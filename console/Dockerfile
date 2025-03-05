# build-env
FROM golang:1.22-bookworm AS api-builder
WORKDIR /go/src/pg-console

COPY console/service/ .

RUN make build_in_docker

FROM node:20-bookworm AS ui-builder
WORKDIR /usr/src/pg-console

COPY console/ui/ .

RUN yarn install --frozen-lockfile --network-timeout 1000000 && yarn vite build

# Build the console image
FROM nginx:1.26-bookworm
LABEL maintainer="Vitaliy Kukharik vitabaks@gmail.com"

COPY --from=api-builder /go/src/pg-console/pg-console /usr/local/bin/
COPY console/db/migrations /etc/db/migrations
COPY --from=ui-builder /usr/src/pg-console/dist /usr/share/nginx/html/
COPY console/ui/nginx/nginx.conf /etc/nginx/
COPY console/ui/env.sh console/ui/.env console/ui/.env.production /usr/share/nginx/html/
RUN chmod +x /usr/share/nginx/html/env.sh

ARG POSTGRES_VERSION
ENV POSTGRES_VERSION=${POSTGRES_VERSION:-16}

ARG POSTGRES_PORT
ENV POSTGRES_PORT=${POSTGRES_PORT:-5432}

ARG POSTGRES_PASSWORD
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-"postgres-pass"}

ARG PGDATA
ENV PGDATA=${PGDATA:-"/var/lib/postgresql/${POSTGRES_VERSION}/main"}

ARG PG_UNIX_SOCKET_DIR
ENV PG_UNIX_SOCKET_DIR=${PG_UNIX_SOCKET_DIR:-"/var/run/postgresql"}

ARG PG_CONSOLE_API_PORT
ENV PG_CONSOLE_API_PORT=${PG_CONSOLE_API_PORT:-8080}

ARG PG_CONSOLE_UI_PORT
ENV PG_CONSOLE_UI_PORT=${PG_CONSOLE_UI_PORT:-80}

# Set SHELL to /bin/bash
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get clean && rm -rf /var/lib/apt/lists/partial \
   && apt-get update -o Acquire::CompressionTypes::Order::=gz \
   && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y \
      gnupg postgresql-common apt-transport-https lsb-release openssh-client ca-certificates wget curl vim \
   # PostgreSQL
   && install -d /usr/share/postgresql-common/pgdg \
   && curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc \
   && echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
   && apt-get update -o Acquire::CompressionTypes::Order::=gz \
   && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y postgresql-${POSTGRES_VERSION} \
   && sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen \
   && pg_dropcluster ${POSTGRES_VERSION} main \
   # TimescaleDB
   && wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | gpg --dearmor -o /etc/apt/trusted.gpg.d/timescaledb.gpg \
   && echo "deb https://packagecloud.io/timescale/timescaledb/debian/ $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/timescaledb.list \
   && apt-get update -o Acquire::CompressionTypes::Order::=gz \
   && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y timescaledb-2-postgresql-${POSTGRES_VERSION} \
   # supervisor
   && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y supervisor

# Clean up
RUN apt-get autoremove -y --purge gnupg wget \
   && apt-get clean -y autoclean \
   && rm -rf /var/lib/apt/lists/*

# Copy configuration files
COPY console/db/postgresql.conf /var/tmp/postgresql.conf
COPY console/db/pg_hba.conf /var/tmp/pg_hba.conf

# Copy pg_start.sh
COPY console/db/pg_start.sh /pg_start.sh
RUN chmod +x /pg_start.sh

# supervisord [https://docs.docker.com/engine/admin/using_supervisord/]
COPY console/supervisord.conf /etc/supervisor/supervisord.conf

VOLUME /var/lib/postgresql

# Console DB
EXPOSE ${POSTGRES_PORT}
# Console API
EXPOSE ${PG_CONSOLE_API_PORT}
# Console UI
EXPOSE ${PG_CONSOLE_UI_PORT}

# Override the ENTRYPOINT set by nginx image
ENTRYPOINT []

CMD ["/usr/bin/supervisord", "--configuration=/etc/supervisor/supervisord.conf", "--nodaemon"]
