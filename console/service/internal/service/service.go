package service

import (
	"postgresql-cluster-console/internal/configuration"
	"postgresql-cluster-console/internal/controllers/cluster"
	"postgresql-cluster-console/internal/controllers/dictionary"
	"postgresql-cluster-console/internal/controllers/environment"
	"postgresql-cluster-console/internal/controllers/operation"
	"postgresql-cluster-console/internal/controllers/project"
	"postgresql-cluster-console/internal/controllers/secret"
	"postgresql-cluster-console/internal/controllers/setting"
	"postgresql-cluster-console/internal/storage"
	"postgresql-cluster-console/internal/watcher"
	"postgresql-cluster-console/internal/xdocker"
	"postgresql-cluster-console/models"
	"postgresql-cluster-console/restapi"
	"postgresql-cluster-console/restapi/operations"
	"postgresql-cluster-console/restapi/operations/system"

	"github.com/go-openapi/runtime/middleware"

	"github.com/go-openapi/loads"
	"github.com/jessevdk/go-flags"
	"github.com/rs/zerolog/log"
)

type IService interface {
	Serve() error
}

type httpService struct {
	srv *restapi.Server
}

func NewService(
	cfg *configuration.Config,
	version string,
	db storage.IStorage,
	dockerManager xdocker.IManager,
	logCollector watcher.LogCollector,
	clusterWatcher watcher.ClusterWatcher,
) (IService, error) {
	swaggerSpec, err := loads.Analyzed(restapi.SwaggerJSON, "2.0")
	if err != nil {
		return nil, err
	}
	api := operations.NewPgConsoleAPI(swaggerSpec)
	srv := restapi.NewServer(api)

	srv.Host = cfg.Http.Host
	srv.Port = cfg.Http.Port
	srv.ReadTimeout = cfg.Http.ReadTimeout
	srv.WriteTimeout = cfg.Http.WriteTimeout
	restapi.Token = cfg.Authorization.Token

	localLog := log.With().Str("module", "http_server").Logger()
	api.Logger = func(s string, i ...interface{}) {
		localLog.Debug().Msgf(s, i...)
	}

	if cfg.Https.IsUsed {
		srv.EnabledListeners = append(srv.EnabledListeners, "https")
		srv.TLSHost = cfg.Https.Host
		srv.TLSPort = cfg.Https.Port
		srv.TLSReadTimeout = cfg.Http.ReadTimeout
		srv.TLSWriteTimeout = cfg.Http.WriteTimeout
		srv.TLSCACertificate = flags.Filename(cfg.Https.CACert)
		srv.TLSCertificate = flags.Filename(cfg.Https.ServerCert)
		srv.TLSCertificateKey = flags.Filename(cfg.Https.ServerKey)
	}

	api.DictionaryGetExternalDeploymentsHandler = dictionary.NewGetExternalDeploymentsHandler(db)
	api.DictionaryGetDatabaseExtensionsHandler = dictionary.NewGetDbExtensionsHandler(db)
	api.DictionaryGetPostgresVersionsHandler = dictionary.NewGetPostgresVersions(db)

	// environment
	api.EnvironmentGetEnvironmentsHandler = environment.NewGetEnvironmentsHandler(db)
	api.EnvironmentPostEnvironmentsHandler = environment.NewPostEnvironmentsHandler(db, log.Logger)
	api.EnvironmentDeleteEnvironmentsIDHandler = environment.NewDeleteEnvironmentsHandler(db, log.Logger)

	// setting
	api.SettingPostSettingsHandler = setting.NewPostSettingHandler(db)
	api.SettingGetSettingsHandler = setting.NewGetSettingsHandler(db)
	api.SettingPatchSettingsNameHandler = setting.NewPatchSettingHandler(db)

	// project
	api.ProjectPostProjectsHandler = project.NewPostProjectHandler(db, log.Logger)
	api.ProjectGetProjectsHandler = project.NewGetProjectsHandler(db)
	api.ProjectDeleteProjectsIDHandler = project.NewDeleteProjectHandler(db, log.Logger)
	api.ProjectPatchProjectsIDHandler = project.NewPatchProjectHandler(db)

	// secret
	api.SecretPostSecretsHandler = secret.NewPostSecretHandler(db, log.Logger, cfg)
	api.SecretGetSecretsHandler = secret.NewGetSecretHandler(db)
	api.SecretDeleteSecretsIDHandler = secret.NewDeleteSecretHandler(db)

	// cluster
	api.ClusterPostClustersHandler = cluster.NewPostClusterHandler(db, dockerManager, logCollector, cfg, log.Logger)
	api.ClusterDeleteClustersIDHandler = cluster.NewDeleteClusterHandler(db)
	api.OperationGetOperationsHandler = operation.NewGetOperationsHandler(db)
	api.OperationGetOperationsIDLogHandler = operation.NewGetOperationLogHandler(db)
	api.ClusterGetClustersHandler = cluster.NewGetClustersHandler(db, log.Logger)
	api.ClusterGetClustersIDHandler = cluster.NewGetClusterHandler(db, log.Logger)
	api.ClusterGetClustersDefaultNameHandler = cluster.NewGetClusterDefaultNameHandler(db, log.Logger)
	api.ClusterDeleteServersIDHandler = cluster.NewDeleteServerHandler(db, log.Logger)
	api.ClusterPostClustersIDRefreshHandler = cluster.NewPostClusterRefreshHandler(db, log.Logger, clusterWatcher)

	api.SystemGetVersionHandler = system.GetVersionHandlerFunc(func(params system.GetVersionParams) middleware.Responder {
		return system.NewGetVersionOK().WithPayload(&models.ResponseVersion{
			Version: version,
		})
	})

	api.Logger = func(s string, i ...interface{}) {
		log.Debug().Msgf(s, i...)
	}

	srv.ConfigureAPI()

	return &httpService{
		srv: srv,
	}, nil
}

func (s *httpService) Serve() error {
	return s.srv.Serve()
}
