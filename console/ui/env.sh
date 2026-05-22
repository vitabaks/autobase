#!/bin/sh

SEARCH_DIR="/usr/share/nginx/html/"
NGINX_CONF="/etc/nginx/nginx.conf"

# file_env VAR — if ${VAR}_FILE is set, replace ${VAR} with the file's contents.
# Mirrors the convention used by the official postgres/mysql images so the
# console can consume Docker Secrets mounted under /run/secrets.
file_env() {
    var="$1"
    fileVar="${var}_FILE"
    eval "varVal=\${$var-}"
    eval "fileVarVal=\${$fileVar-}"
    if [ -n "$varVal" ] && [ -n "$fileVarVal" ]; then
        echo "error: both $var and $fileVar are set; choose one" >&2
        exit 1
    fi
    if [ -n "$fileVarVal" ]; then
        if [ ! -r "$fileVarVal" ]; then
            echo "error: secret file '$fileVarVal' for $var is not readable" >&2
            exit 1
        fi
        # $(cat ...) trims any trailing newlines per POSIX, matching the
        # postgres image's file_env behavior.
        secretVal=$(cat "$fileVarVal")
        export "$var=$secretVal"
    fi
    unset varVal fileVarVal secretVal
}

# Resolve Docker Secret-backed env vars before deriving downstream values.
file_env PG_CONSOLE_AUTHORIZATION_TOKEN
file_env VITE_AUTH_TOKEN

# Set default values for environment variables if they are not set
export VITE_API_URL=${VITE_API_URL:-${PG_CONSOLE_API_URL:-"/api/v1"}}
export VITE_AUTH_TOKEN=${VITE_AUTH_TOKEN:-${PG_CONSOLE_AUTHORIZATION_TOKEN:-"auth_token"}}
export VITE_CLUSTERS_POLLING_INTERVAL=${PG_CONSOLE_CLUSTERS_POLLING_INTERVAL:-"60000"}
export VITE_CLUSTER_OVERVIEW_POLLING_INTERVAL=${PG_CONSOLE_CLUSTER_OVERVIEW_POLLING_INTERVAL:-"60000"}
export VITE_OPERATIONS_POLLING_INTERVAL=${PG_CONSOLE_OPERATIONS_POLLING_INTERVAL:-"60000"}
export VITE_OPERATION_LOGS_POLLING_INTERVAL=${PG_CONSOLE_OPERATION_LOGS_POLLING_INTERVAL:-"10000"}
export VITE_DBDESK_URL=${PG_CONSOLE_DBDESK_STUDIO_URL:-"/dbdesk/"}

# API host/port envs for nginx
API_HOST="${PG_CONSOLE_API_HOST:-127.0.0.1}"
API_PORT="${PG_CONSOLE_API_PORT:-8080}"
DBDESK_EXPRESS="${DBDESK_EXPRESS_PORT:-6789}"
DBDESK_HOST="${PG_CONSOLE_DBDESK_STUDIO_HOST:-127.0.0.1}"
DBDESK_LISTEN="${PG_CONSOLE_DBDESK_STUDIO_PORT:-9876}"

# 1) Patch nginx.conf placeholders
sed -i -e "
  s|REPLACE_ME_WITH_API_HOST|$API_HOST|g;
  s|REPLACE_ME_WITH_API_PORT|$API_PORT|g;
  s|REPLACE_ME_WITH_DBDESK_EXPRESS_PORT|$DBDESK_EXPRESS|g;
  s|REPLACE_ME_WITH_DBDESK_HOST|$DBDESK_HOST|g;
  s|REPLACE_ME_WITH_DBDESK_LISTEN_PORT|$DBDESK_LISTEN|g;
" "$NGINX_CONF"

# 2) Patch built JS with runtime env
find "${SEARCH_DIR}" -type f -name '*.js' -exec sed -i -e "
  s|REPLACE_ME_WITH_API_URL|${VITE_API_URL}|g;
  s|REPLACE_ME_WITH_AUTH_TOKEN|${VITE_AUTH_TOKEN}|g;
  s|REPLACE_ME_WITH_CLUSTERS_POLLING_INTERVAL|${VITE_CLUSTERS_POLLING_INTERVAL}|g;
  s|REPLACE_ME_WITH_CLUSTER_OVERVIEW_POLLING_INTERVAL|${VITE_CLUSTER_OVERVIEW_POLLING_INTERVAL}|g;
  s|REPLACE_ME_WITH_OPERATIONS_POLLING_INTERVAL|${VITE_OPERATIONS_POLLING_INTERVAL}|g;
  s|REPLACE_ME_WITH_OPERATION_LOGS_POLLING_INTERVAL|${VITE_OPERATION_LOGS_POLLING_INTERVAL}|g;
  s|REPLACE_ME_WITH_DBDESK_URL|${VITE_DBDESK_URL}|g;
" {} \;
