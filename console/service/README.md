# Autobase Console API service

Server-side component for autobase console. This REST service implements the API for UI integration.

The project is written in `Go` and uses [Swagger](https://github.com/go-swagger/go-swagger) for server-side code generation. The server receives requests from the web to create and manage clusters. Under the hood, the server uses Docker to run `autobase/automation` image with Ansible playbooks for cluster deployment logic.

## Build
Swagger specification is used for creating the server REST API. First, you need to install the Swagger tool to build the auto-generated Go files.
```
export dir=$$(mktemp -d)
git clone https://github.com/go-swagger/go-swagger "$$dir"
cd "$$dir"
go install ./cmd/swagger
```
Then, you need to generate the server-side files:
```
swagger generate server --name DbConsole --spec api/swagger.yaml --principal interface{} --exclude-main
```

After that, you can build the server with the following command:
```
go build -o pg-console main.go
```

The project also contains a Makefile with all commands, so you can simply run the following steps:
```
make swagger_install
make swagger
make build
```

## Configuration
Server is configured via the environment. The following environment variables can be used:
```
KEY                                   TYPE                DEFAULT                              REQUIRED    DESCRIPTION
PG_CONSOLE_LOGGER_LEVEL               String              DEBUG                                            Log level. Accepted values: [TRACE, DEBUG, INFO, WARN, ERROR, FATAL, PANIC]
PG_CONSOLE_HTTP_HOST                  String              0.0.0.0                                          Accepted host for connection. '0.0.0.0' for all hosts
PG_CONSOLE_HTTP_PORT                  Integer             8080                                             Listening port
PG_CONSOLE_HTTP_WRITETIMEOUT          Duration            10s                                              Maximum duration before timing out write of the response
PG_CONSOLE_HTTP_READTIMEOUT           Duration            10s                                              Maximum duration before timing out read of the request
PG_CONSOLE_HTTPS_ISUSED               True or False       false                                            Flag for turn on/off https
PG_CONSOLE_HTTPS_HOST                 String              0.0.0.0                                          Accepted host for connection. '0.0.0.0' for all hosts
PG_CONSOLE_HTTPS_PORT                 Integer             8081                                             Listening port
PG_CONSOLE_HTTPS_CACERT               String              /etc/pg_console/cacert.pem                       The certificate to use for secure connections
PG_CONSOLE_HTTPS_SERVERCERT           String              /etc/pg_console/server-cert.pem                  The certificate authority file to be used with mutual tls auth
PG_CONSOLE_HTTPS_SERVERKEY            String              /etc/pg_console/server-key.pem                   The private key to use for secure connections
PG_CONSOLE_AUTHORIZATION_TOKEN        String              auth_token                                       Authorization token for REST API
PG_CONSOLE_DB_HOST                    String              localhost                                        Database host
PG_CONSOLE_DB_PORT                    Unsigned Integer    5432                                             Database port
PG_CONSOLE_DB_DBNAME                  String              postgres                                         Database name
PG_CONSOLE_DB_USER                    String              postgres                                         Database user name
PG_CONSOLE_DB_PASSWORD                String              postgres-pass                                    Database user password
PG_CONSOLE_DB_MAXCONNS                Integer             10                                               MaxConns is the maximum size of the pool
PG_CONSOLE_DB_MAXCONNLIFETIME         Duration            60s                                              MaxConnLifetime is the duration since creation after which a connection will be automatically closed
PG_CONSOLE_DB_MAXCONNIDLETIME         Duration            60s                                              MaxConnIdleTime is the duration after which an idle connection will be automatically closed by the health check
PG_CONSOLE_DB_MIGRATIONDIR            String              /etc/db/migrations                               Path to directory with migration scripts
PG_CONSOLE_ENCRYPTIONKEY              String              super_secret                                     Encryption key for secret storage
PG_CONSOLE_DOCKER_HOST                String              unix:///var/run/docker.sock                      Docker host
PG_CONSOLE_DOCKER_LOGDIR              String              /tmp/ansible                                     Directory inside docker container for ansible json log
PG_CONSOLE_DOCKER_IMAGE               String              autobase/automation:2.2.0                        Docker image for autobase automation
PG_CONSOLE_LOGWATCHER_RUNEVERY        Duration            1m                                               LogWatcher run interval
PG_CONSOLE_LOGWATCHER_ANALYZEPAST     Duration            48h                                              LogWatcher gets operations to analyze which created_at > now() - AnalyzePast
PG_CONSOLE_CLUSTERWATCHER_RUNEVERY    Duration            1m                                               ClusterWatcher run interval
PG_CONSOLE_CLUSTERWATCHER_POOLSIZE    Integer             4                                                Amount of async request from ClusterWatcher
```

Note: Be attention to use `TRACE` level of logging. With `TRACE` level some kind of secrets can be present in logs.

## Project structure
```
|-api - Swagger specification
|-internal - Folder with all internal logic
| |-configuration - Configuration
| |-controllers - REST functions and basic logic for handlers
| | |-cluster - REST API for cluster objects
| | |-dictionary - REST API for dictionary objects
| | |-environment - REST API for environment objects
| | |-operation - REST API for operation objects
| | |-project - REST API for project objects
| | |-secret - REST API for secret objects
| | |-setting - REST API for setting objects
| |-convert - Functions for converting DB model to REST model
| |-db - Basic DB functions
| |-service - Common logic for aggregating all server logic
| |-storage - DB logic
| |-watcher - Async watchers
| | |-log_collector.go - Collecting logs from running Docker containers
| | |-log_watcher.go - JSON container log parser
| | |-cluster_watcher.go - Collecting cluster statuses  
| |-xdocker - Basic logic for Docker
|-middleware - Common REST middleware for the server
|-migrations - DB migration logic   
|-pkg - Folder with common logic
| |-patroni - Client for Patroni integration
| |-tracer - Base structure for tracing
|-*models - Auto-generated files with REST models
|-*restapi - Auto-generated files with REST server
|-main.go - Entry point
```

## Secrets
The server handles different kinds of secrets, such as:

* Cloud secrets used for cloud connections
* SSH keys and passwords for connection to own machine servers
