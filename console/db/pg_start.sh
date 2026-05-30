#!/bin/bash
set -e

log() {
  echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
}

# file_env VAR — if ${VAR}_FILE is set, replace ${VAR} with the file's contents.
# Mirrors the convention used by the official postgres image so this custom
# console_db container can consume Docker Secrets mounted under /run/secrets.
file_env() {
  local var="$1"
  local fileVar="${var}_FILE"
  if [ -n "${!var:-}" ] && [ -n "${!fileVar:-}" ]; then
    log "error: both $var and $fileVar are set; choose one"
    exit 1
  fi
  if [ -n "${!fileVar:-}" ]; then
    if [ ! -r "${!fileVar}" ]; then
      log "error: secret file '${!fileVar}' for $var is not readable"
      exit 1
    fi
    # $(cat ...) trims trailing newlines, matching the postgres image.
    export "$var=$(cat "${!fileVar}")"
  fi
}

file_env POSTGRES_PASSWORD

# Ensure the directory exists and has the correct permissions
mkdir -p ${PGDATA} ${PG_UNIX_SOCKET_DIR} /etc/postgresql/${POSTGRES_VERSION}/main
chown -R postgres:postgres ${PGDATA} ${PG_UNIX_SOCKET_DIR} /etc/postgresql/${POSTGRES_VERSION}/main

# Create PGDATA if not exists
if [[ ! -d "${PGDATA}/base" ]]; then
  log "Creating PostgreSQL data directory..."
  su - postgres -c "pg_createcluster --locale en_US.UTF-8 ${POSTGRES_VERSION} main -d ${PGDATA} -- --data-checksums"
  mv /etc/postgresql/${POSTGRES_VERSION}/main/postgresql.conf /etc/postgresql/${POSTGRES_VERSION}/main/postgresql.base.conf
fi

# Check if the config file exists, if not, copy it
if [[ ! -f "/etc/postgresql/${POSTGRES_VERSION}/main/postgresql.conf" ]]; then
  cp /var/tmp/postgresql.conf /etc/postgresql/${POSTGRES_VERSION}/main/postgresql.conf
  cp /var/tmp/pg_hba.conf /etc/postgresql/${POSTGRES_VERSION}/main/pg_hba.conf
  # Update data_directory in postgresql.conf
  sed -i "s|^data_directory = .*|data_directory = '${PGDATA}'|" /etc/postgresql/${POSTGRES_VERSION}/main/postgresql.conf
fi

# Start postgres
log "Starting PostgreSQL..."
su - postgres -c "/usr/lib/postgresql/${POSTGRES_VERSION}/bin/postgres -D ${PGDATA} -k ${PG_UNIX_SOCKET_DIR} -p ${POSTGRES_PORT} -c config_file=/etc/postgresql/${POSTGRES_VERSION}/main/postgresql.conf" &

for i in {1..300}; do
  if pg_isready -h ${PG_UNIX_SOCKET_DIR} -p ${POSTGRES_PORT}; then
    log "Postgres is ready!"
    break
  else
    log "Postgres is not ready yet. Waiting..."
    sleep 2
  fi
done

# Reset postgres password
log "Resetting postgres password..."
psql -h ${PG_UNIX_SOCKET_DIR} -p ${POSTGRES_PORT} -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD '${POSTGRES_PASSWORD}';"

# Create timescaledb extension (if not exists)
log "Creating TimescaleDB extension..."
psql -h ${PG_UNIX_SOCKET_DIR} -p ${POSTGRES_PORT} -U postgres -d postgres -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"

# Infinite sleep to allow restarting Postgres
/bin/bash -c "trap : TERM INT; sleep infinity & wait"
