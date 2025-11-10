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

	// Parse ExtraVars JSON string from request
	extraVars := map[string]interface{}{}
	if param.Body.ExtraVars != "" {
		if err := json.Unmarshal([]byte(param.Body.ExtraVars), &extraVars); err != nil {
			localLog.Warn().Str("extra_vars_raw", param.Body.ExtraVars).Err(err).Msg("failed to parse extra_vars JSON; using empty object")
		}
	}

	if paramLocation == EnvParamLocation {
		param.Body.Envs = append(param.Body.Envs, secretEnvs...)
	} else if paramLocation == ExtraVarsParamLocation {
		for _, kv := range secretEnvs {
			parts := strings.SplitN(kv, "=", 2)
			if len(parts) == 2 {
				extraVars[parts[0]] = parts[1]
			}
		}
	}
	param.Body.Envs = append(param.Body.Envs, ansibleLogEnv...)

	h.addProxySettings(extraVars, &param, localLog)

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
		inventoryJson    InventoryJson
	)

	// If no cloud_provider is specified, expect inventory (in envs)
	if getValFromExtraVars(extraVars, CloudProviderExtraVar) == "" {
		rawInventory := getValFromVars(param.Body.Envs, InventoryJsonEnv)

		if rawInventory != "" {
			// Try to decode the inventory as base64
			decodedInventory, decodeErr := base64.StdEncoding.DecodeString(rawInventory)
			if decodeErr != nil {
				// If base64 decoding fails, treat it as plain JSON
				localLog.Warn().Str("inventory_json", rawInventory).Err(decodeErr).Msg("base64 decode failed, trying as plain JSON")
				decodedInventory = []byte(rawInventory)
			}

			// Try to parse the decoded inventory as JSON
			if err := json.Unmarshal(decodedInventory, &inventoryJson); err != nil {
				localLog.Error().Str("inventory_json", string(decodedInventory)).Err(err).Msg("failed to parse inventory json")
				inventoryJsonVal = nil // to correct insert in db
			} else {
				// If successfully parsed, save it and calculate server count
				inventoryJsonVal = decodedInventory
				serverCount = len(inventoryJson.All.Children.Master.Hosts) + len(inventoryJson.All.Children.Replica.Hosts)
			}
		} else {
			// No inventory found in envs; fallback to 0
			localLog.Warn().Str("inventory_json", "").Msg("ANSIBLE_INVENTORY_JSON not found in Envs")
			serverCount = 0
		}
	} else {
		// For cloud providers, expect server count to be explicitly passed in extra vars
		serverCount = getIntValFromExtraVars(extraVars, ServersExtraVar)
	}

	status := "deploying"
	if existing {
		status = "ready"
	}

	// Marshal updated extraVars to JSON string for DB / Docker
	extraVarsBytes, mErr := json.Marshal(extraVars)
	if mErr != nil {
		localLog.Error().Err(mErr).Msg("failed to marshal extra_vars; falling back to {}")
		extraVarsBytes = []byte("{}")
	}
	extraVarsJSON := string(extraVarsBytes)

	createdCluster, err := h.db.CreateCluster(param.HTTPRequest.Context(), &storage.CreateClusterReq{
		ProjectID:         param.Body.ProjectID,
		EnvironmentID:     param.Body.EnvironmentID,
		Name:              param.Body.Name,
		Description:       param.Body.Description,
		SecretID:          secretID,
		ExtraVars:         extraVarsJSON,
		Location:          getValFromExtraVars(extraVars, LocationExtraVar),
		ServerCount:       serverCount,
		PostgreSqlVersion: getIntValFromExtraVars(extraVars, PostgreSqlVersionExtraVar),
		Status:            status,
		Inventory:         inventoryJsonVal,
	})
	if err != nil {
		return cluster.NewPostClustersBadRequest().WithPayload(controllers.MakeErrorPayload(err, controllers.BaseError))
	}
	localLog.Info().Any("cluster", createdCluster).Msg("cluster was created")

	// Handle imported cluster: skip deployment and insert servers from inventory
	if existing {
		localLog.Info().Msg("existing_cluster=true; skipping the deployment process")

		// Insert servers if inventory is present
		if len(inventoryJsonVal) > 0 {
			if inventoryJson.All.Children.Master.Hosts == nil {
				inventoryJson.All.Children.Master.Hosts = make(map[string]interface{})
				localLog.Debug().Msg("Master hosts map was nil")
			}
			if inventoryJson.All.Children.Replica.Hosts == nil {
				inventoryJson.All.Children.Replica.Hosts = make(map[string]interface{})
				localLog.Debug().Msg("Replica hosts map was nil")
			}

			// Insert master
			for ip, hostData := range inventoryJson.All.Children.Master.Hosts {
				hostMap, ok := hostData.(map[string]interface{})
				if !ok {
					localLog.Warn().Str("ip", ip).Msg("invalid master host format")
					continue
				}

				hostname, _ := hostMap["hostname"].(string)
				location, _ := hostMap["server_location"].(string)

				_, err = h.db.CreateServer(param.HTTPRequest.Context(), &storage.CreateServerReq{
					ClusterID:      createdCluster.ID,
					ServerName:     hostname,
					ServerLocation: &location,
					IpAddress:      ip,
				})
				if err != nil {
					localLog.Error().Err(err).Str("ip", ip).Msg("failed to insert master server")
					return cluster.NewPostClustersBadRequest().WithPayload(controllers.MakeErrorPayload(err, controllers.BaseError))
				}
			}

			// Insert replicas
			for ip, hostData := range inventoryJson.All.Children.Replica.Hosts {
				hostMap, ok := hostData.(map[string]interface{})
				if !ok {
					localLog.Warn().Str("ip", ip).Msg("invalid replica host format")
					continue
				}

				hostname, _ := hostMap["hostname"].(string)
				location, _ := hostMap["server_location"].(string)

				_, err = h.db.CreateServer(param.HTTPRequest.Context(), &storage.CreateServerReq{
					ClusterID:      createdCluster.ID,
					ServerName:     hostname,
					ServerLocation: &location,
					IpAddress:      ip,
				})
				if err != nil {
					localLog.Error().Err(err).Str("ip", ip).Msg("failed to insert replica server")
					return cluster.NewPostClustersBadRequest().WithPayload(controllers.MakeErrorPayload(err, controllers.BaseError))
				}
			}
		}

		// Skip deployment
		return cluster.NewPostClustersOK().WithPayload(&models.ResponseClusterCreate{
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
		ExtraVars: extraVarsJSON,
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

func (h *postClusterHandler) addProxySettings(extraVars map[string]interface{}, param *cluster.PostClustersParams, localLog zerolog.Logger) {
	const proxySettingName = "proxy_env"
	proxySetting, err := h.db.GetSettingByName(param.HTTPRequest.Context(), proxySettingName)
	if err != nil {
		localLog.Warn().Err(err).Msg("failed to get proxy setting")
		return
	}
	if proxySetting != nil {
		extraVars[proxySettingName] = proxySetting.Value
		localLog.Info().Any("proxy_env", proxySetting.Value).Msg("proxy_env added to extra_vars JSON")
	}
}

const ansibleLogDir = "/tmp/ansible"

func (h *postClusterHandler) getAnsibleLogEnv(clusterName string) []string {
	return []string{"ANSIBLE_JSON_LOG_FILE=" + ansibleLogDir + "/" + clusterName + ".json"}
}

func getValFromVars(vars []string, key string) string {
	normalizedKey := strings.ToLower(key) + "="

	for _, kv := range vars {
		if strings.HasPrefix(strings.ToLower(kv), normalizedKey) {
			// Split once on '=' and return the value
			parts := strings.SplitN(kv, "=", 2)
			if len(parts) == 2 {
				return parts[1]
			}
		}
	}
	// Return empty string if not found
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

// JSON helpers
func getValFromExtraVars(m map[string]interface{}, key string) string {
	v, ok := m[key]
	if !ok || v == nil {
		return ""
	}
	switch t := v.(type) {
	case string:
		return t
	case float64:
		return strconv.FormatFloat(t, 'f', -1, 64)
	case bool:
		if t {
			return "true"
		}
		return "false"
	default:
		b, err := json.Marshal(t)
		if err != nil {
			return ""
		}
		return string(b)
	}
}

func getIntValFromExtraVars(m map[string]interface{}, key string) int {
	v, ok := m[key]
	if !ok || v == nil {
		return 0
	}
	switch t := v.(type) {
	case float64:
		return int(t)
	case int:
		return t
	case int32:
		return int(t)
	case int64:
		return int(t)
	case string:
		n, err := strconv.Atoi(t)
		if err != nil {
			return 0
		}
		return n
	default:
		return 0
	}
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
