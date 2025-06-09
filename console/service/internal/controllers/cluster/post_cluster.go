package cluster

import (
	"encoding/json"
	"fmt"
	"postgresql-cluster-console/internal/configuration"
	"postgresql-cluster-console/internal/controllers"
	"postgresql-cluster-console/internal/storage"
	"postgresql-cluster-console/internal/watcher"
	"postgresql-cluster-console/internal/xdocker"
	"postgresql-cluster-console/models"
	"postgresql-cluster-console/pkg/tracer"
	"postgresql-cluster-console/restapi/operations/cluster"
	"strconv"
	"strings"

	"github.com/go-openapi/runtime/middleware"
	"github.com/rs/zerolog"
	"github.com/segmentio/asm/base64"
	"go.openly.dev/pointy"
)

type postClusterHandler struct {
	db            storage.IStorage
	dockerManager xdocker.IManager
	logCollector  watcher.LogCollector
	log           zerolog.Logger
	cfg           *configuration.Config
}

func NewPostClusterHandler(db storage.IStorage, dockerManager xdocker.IManager, logCollector watcher.LogCollector, cfg *configuration.Config, log zerolog.Logger) cluster.PostClustersHandler {
	return &postClusterHandler{
		db:            db,
		dockerManager: dockerManager,
		logCollector:  logCollector,
		log:           log,
		cfg:           cfg,
	}
}

func (h *postClusterHandler) Handle(param cluster.PostClustersParams) middleware.Responder {
	cid := param.HTTPRequest.Context().Value(tracer.CtxCidKey{}).(string)
	localLog := h.log.With().Str("cid", cid).Logger()
	oldCluster, err := h.db.GetClusterByName(param.HTTPRequest.Context(), param.Body.Name)
	if err != nil {
		localLog.Warn().Err(err).Msg("can't get cluster by name")
	}
	if oldCluster != nil {
		localLog.Trace().Any("old_cluster", oldCluster).Msg("cluster already exists")

		return cluster.NewPostClustersBadRequest().WithPayload(controllers.MakeErrorPayload(fmt.Errorf("cluster %s already exists", param.Body.Name), controllers.BaseError))
	}

	var (
		secretEnvs    []string
		secretID      *int64
		existing      bool = false
		paramLocation ParamLocation
	)
	if param.Body.AuthInfo != nil {
		secretEnvs, paramLocation, err = getSecretEnvs(param.HTTPRequest.Context(), h.log, h.db, param.Body.AuthInfo.SecretID, h.cfg.EncryptionKey)
		if err != nil {
			localLog.Error().Err(err).Msg("failed to get secret")

			return cluster.NewPostClustersBadRequest().WithPayload(controllers.MakeErrorPayload(fmt.Errorf("failed to get secret: %s", err.Error()), controllers.BaseError))
		}
		secretID = &param.Body.AuthInfo.SecretID
		localLog.Trace().Strs("secretEnvs", secretEnvs).Msg("got secret")
	} else {
		localLog.Debug().Msg("AuthInfo is nil, secret is expected in envs from web")
	}

	if param.Body.ExistingCluster != nil && *param.Body.ExistingCluster {
		existing = true
	}

	ansibleLogEnv := h.getAnsibleLogEnv(param.Body.Name)
	localLog.Trace().Strs("file_log", ansibleLogEnv).Msg("got file log name")

	if paramLocation == EnvParamLocation {
		param.Body.Envs = append(param.Body.Envs, secretEnvs...)
	} else if paramLocation == ExtraVarsParamLocation {
		param.Body.ExtraVars = append(param.Body.ExtraVars, secretEnvs...)
	}
	param.Body.Envs = append(param.Body.Envs, ansibleLogEnv...)
	param.Body.ExtraVars = append(param.Body.ExtraVars, "patroni_cluster_name="+param.Body.Name)

	h.addProxySettings(&param, localLog)

	const (
		LocationExtraVar          = "server_location"
		CloudProviderExtraVar     = "cloud_provider"
		ServersExtraVar           = "server_count"
		PostgreSqlVersionExtraVar = "postgresql_version"
		InventoryJsonEnv          = "ANSIBLE_INVENTORY_JSON"
	)

	var (
		serverCount      int
		inventoryJsonVal []byte
	)

	if getValFromVars(param.Body.ExtraVars, CloudProviderExtraVar) == "" {
		inventoryJsonVal = []byte(getValFromVars(param.Body.Envs, InventoryJsonEnv))
		var inventoryJson InventoryJson
		err = json.Unmarshal(inventoryJsonVal, &inventoryJson)
		if err != nil {
			localLog.Debug().Err(err).Str("inventory_json_val", string(inventoryJsonVal)).Msg("failed to parse inventory json, try to base64 decode")
			inventoryJsonVal, err = base64.StdEncoding.DecodeString(string(inventoryJsonVal))
			if err != nil {
				localLog.Debug().Err(err).Msg("failed to base64 decode inventory json")
				inventoryJsonVal = nil // to correct insert in db
			} else {
				err = json.Unmarshal(inventoryJsonVal, &inventoryJson)
				if err != nil {
					localLog.Debug().Err(err).Str("inventory_json_val", string(inventoryJsonVal)).Msg("failed to parse inventory json")
					inventoryJsonVal = nil // to correct insert to db
				} else {
					serverCount = len(inventoryJson.All.Children.Master.Hosts) + len(inventoryJson.All.Children.Replica.Hosts)
				}
			}
		} else {
			serverCount = len(inventoryJson.All.Children.Master.Hosts) + len(inventoryJson.All.Children.Replica.Hosts)
		}
	} else {
		serverCount = getIntValFromVars(param.Body.ExtraVars, ServersExtraVar)
	}

	status := "deploying"
	if existing {
		status = "ready"
	}
	createdCluster, err := h.db.CreateCluster(param.HTTPRequest.Context(), &storage.CreateClusterReq{
		ProjectID:         param.Body.ProjectID,
		EnvironmentID:     param.Body.EnvironmentID,
		Name:              param.Body.Name,
		Description:       param.Body.Description,
		SecretID:          secretID,
		ExtraVars:         param.Body.ExtraVars,
		Location:          getValFromVars(param.Body.ExtraVars, LocationExtraVar),
		ServerCount:       serverCount,
		PostgreSqlVersion: getIntValFromVars(param.Body.ExtraVars, PostgreSqlVersionExtraVar),
		Status:            status,
		Inventory:         inventoryJsonVal,
	})
	if err != nil {
		return cluster.NewPostClustersBadRequest().WithPayload(controllers.MakeErrorPayload(err, controllers.BaseError))
	}
	localLog.Info().Any("cluster", createdCluster).Msg("cluster was created")

	if existing {
		localLog.Info().Msg("existing_cluster=true; skipping Ansible/Docker deployment")
		return cluster.NewPostClustersOK().
			WithPayload(&models.ResponseClusterCreate{
				ClusterID: createdCluster.ID,
			})
	}

	defer func() {
		if err != nil {
			_, err = h.db.UpdateCluster(param.HTTPRequest.Context(), &storage.UpdateClusterReq{
				ID:     createdCluster.ID,
				Status: pointy.String(storage.ClusterStatusFailed),
			})
			if err != nil {
				localLog.Error().Err(err).Msg("failed to update cluster")
			}
		}
	}()

	var dockerId xdocker.InstanceID
	dockerId, err = h.dockerManager.ManageCluster(param.HTTPRequest.Context(), &xdocker.ManageClusterConfig{
		Envs:      param.Body.Envs,
		ExtraVars: param.Body.ExtraVars,
		Mounts: []xdocker.Mount{
			{
				DockerPath: ansibleLogDir,
				HostPath:   h.cfg.Docker.LogDir,
			},
		},
	})
	if err != nil {
		return cluster.NewPostClustersBadRequest().WithPayload(controllers.MakeErrorPayload(err, controllers.BaseError))
	}
	localLog.Info().Str("docker_id", string(dockerId)).Msg("docker was started")

	var createdOperation *storage.Operation
	createdOperation, err = h.db.CreateOperation(param.HTTPRequest.Context(), &storage.CreateOperationReq{
		ProjectID:  param.Body.ProjectID,
		ClusterID:  createdCluster.ID,
		DockerCode: string(dockerId),
		Type:       storage.OperationTypeDeploy,
		Cid:        cid,
	})
	if err != nil {
		return cluster.NewPostClustersBadRequest().WithPayload(controllers.MakeErrorPayload(err, controllers.BaseError))
	}
	localLog.Info().Any("operation", createdOperation).Msg("operation was created")
	h.logCollector.StoreInDb(createdOperation.ID, dockerId, cid)

	return cluster.NewPostClustersOK().WithPayload(&models.ResponseClusterCreate{
		ClusterID:   createdCluster.ID,
		OperationID: createdOperation.ID,
	})
}

func (h *postClusterHandler) addProxySettings(param *cluster.PostClustersParams, localLog zerolog.Logger) {
	const proxySettingName = "proxy_env"
	proxySetting, err := h.db.GetSettingByName(param.HTTPRequest.Context(), proxySettingName)
	if err != nil {
		localLog.Warn().Err(err).Msg("failed to get proxy setting")
	}
	if proxySetting != nil {
		proxySettingVal, err := json.Marshal(proxySetting.Value)
		if err != nil {
			localLog.Error().Any("proxy_env", proxySetting.Value).Err(err).Msg("failed to marshal proxy_env")
		} else {
			param.Body.ExtraVars = append(param.Body.ExtraVars, proxySettingName+"="+string(proxySettingVal))
			localLog.Info().Str("proxy_env", string(proxySettingVal)).Msg("proxy_env was added to --extra-vars")
		}
	}
}

const ansibleLogDir = "/tmp/ansible"

func (h *postClusterHandler) getAnsibleLogEnv(clusterName string) []string {
	return []string{"ANSIBLE_JSON_LOG_FILE=" + ansibleLogDir + "/" + clusterName + ".json"}
}

func getValFromVars(vars []string, key string) string {
	for _, extraVar := range vars {
		if strings.HasPrefix(strings.ToLower(extraVar), strings.ToLower(key)) {
			keyVal := strings.Split(extraVar, "=")
			if len(keyVal) != 2 {
				return ""
			}

			return keyVal[1]
		}
	}

	return ""
}

func getIntValFromVars(vars []string, key string) int {
	valStr := getValFromVars(vars, key)
	valInt, err := strconv.Atoi(valStr)
	if err != nil {
		return 0
	}

	return valInt
}

type InventoryJson struct {
	All struct {
		Children struct {
			Master struct {
				Hosts map[string]interface{} `json:"hosts"`
			} `json:"master"`
			Replica struct {
				Hosts map[string]interface{} `json:"hosts"`
			} `json:"replica"`
		} `json:"children"`
	} `json:"all"`
}
