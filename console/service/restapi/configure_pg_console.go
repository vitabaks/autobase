// This file is safe to edit. Once it exists it will not be overwritten

package restapi

import (
	"crypto/tls"
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"

	localmid "postgresql-cluster-console/middleware"
	"postgresql-cluster-console/restapi/operations"
	"postgresql-cluster-console/restapi/operations/cluster"
	"postgresql-cluster-console/restapi/operations/dictionary"
	"postgresql-cluster-console/restapi/operations/system"
)

//go:generate swagger generate server --target ../../pg_console --name PgConsole --spec ../api/swagger.yaml --principal interface{} --exclude-main

func configureFlags(api *operations.PgConsoleAPI) {
	// api.CommandLineOptionsGroups = []swag.CommandLineOptionsGroup{ ... }
}

func configureAPI(api *operations.PgConsoleAPI) http.Handler {
	// configure the api here
	api.ServeError = errors.ServeError

	// Set your custom logger if needed. Default one is log.Printf
	// Expected interface func(string, ...interface{})
	//
	// Example:
	// api.Logger = log.Printf

	api.UseSwaggerUI()
	// To continue using redoc as your UI, uncomment the following line
	// api.UseRedoc()

	api.JSONConsumer = runtime.JSONConsumer()

	api.JSONProducer = runtime.JSONProducer()

	if api.ClusterGetClustersHandler == nil {
		api.ClusterGetClustersHandler = cluster.GetClustersHandlerFunc(func(params cluster.GetClustersParams) middleware.Responder {
			return middleware.NotImplemented("operation cluster.GetClusters has not yet been implemented")
		})
	}
	if api.ClusterGetClustersIDHandler == nil {
		api.ClusterGetClustersIDHandler = cluster.GetClustersIDHandlerFunc(func(params cluster.GetClustersIDParams) middleware.Responder {
			return middleware.NotImplemented("operation cluster.GetClustersID has not yet been implemented")
		})
	}
	if api.DictionaryGetDatabaseExtensionsHandler == nil {
		api.DictionaryGetDatabaseExtensionsHandler = dictionary.GetDatabaseExtensionsHandlerFunc(func(params dictionary.GetDatabaseExtensionsParams) middleware.Responder {
			return middleware.NotImplemented("operation dictionary.GetDatabaseExtensions has not yet been implemented")
		})
	}
	if api.DictionaryGetExternalDeploymentsHandler == nil {
		api.DictionaryGetExternalDeploymentsHandler = dictionary.GetExternalDeploymentsHandlerFunc(func(params dictionary.GetExternalDeploymentsParams) middleware.Responder {
			return middleware.NotImplemented("operation dictionary.GetExternalDeployments has not yet been implemented")
		})
	}
	if api.SystemGetVersionHandler == nil {
		api.SystemGetVersionHandler = system.GetVersionHandlerFunc(func(params system.GetVersionParams) middleware.Responder {
			return middleware.NotImplemented("operation system.GetVersion has not yet been implemented")
		})
	}
	if api.ClusterPostClustersHandler == nil {
		api.ClusterPostClustersHandler = cluster.PostClustersHandlerFunc(func(params cluster.PostClustersParams) middleware.Responder {
			return middleware.NotImplemented("operation cluster.PostClusters has not yet been implemented")
		})
	}
	api.PreServerShutdown = func() {}

	api.ServerShutdown = func() {}

	return setupGlobalMiddleware(api.Serve(setupMiddlewares))
}

// The TLS configuration before HTTPS server starts.
func configureTLS(tlsConfig *tls.Config) {
	// Make all necessary changes to the TLS configuration here.
}

// As soon as server is initialized but not run yet, this function will be called.
// If you need to modify a config, store server instance to stop it individually later, this is the place.
// This function can be called multiple times, depending on the number of serving schemes.
// scheme value will be set accordingly: "http", "https" or "unix".
func configureServer(s *http.Server, scheme, addr string) {
}

// The middleware configuration is for the handler executors. These do not apply to the swagger.json document.
// The middleware executes after routing but before authentication, binding and validation.
func setupMiddlewares(handler http.Handler) http.Handler {
	return handler
}

var Token string

// The middleware configuration happens before anything, this middleware also applies to serving the swagger.json document.
// So this is a good place to plug in a panic handling middleware, logging and metrics.
func setupGlobalMiddleware(handler http.Handler) http.Handler {
	return localmid.SetCorrelationId(localmid.CORS(localmid.RequestZeroLog(localmid.Authorization(Token, handler))))
}
