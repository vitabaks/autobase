ARG POSTGRES_VERSION=17
ARG DISTRO_VERSION=bookworm

FROM postgres:${POSTGRES_VERSION}-${DISTRO_VERSION}
LABEL maintainer="Autobase <info@autobase.tech>"

ARG POSTGRES_VERSION
ENV POSTGRES_VERSION=${POSTGRES_VERSION:-17}

ARG POSTGRES_PORT
ENV POSTGRES_PORT=${POSTGRES_PORT:-5432}

ARG WALG_VERSION
ENV WALG_VERSION=${WALG_VERSION:-3.0.7}

ARG PGVECTORSCALE_VERSION
ENV PGVECTORSCALE_VERSION=${PGVECTORSCALE_VERSION:-0.7.1}

# Set SHELL to /bin/bash
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get clean && rm -rf /var/lib/apt/lists/partial \
    && apt-get update -o Acquire::CompressionTypes::Order::=gz && apt-get upgrade -y \
    && apt-get install --no-install-recommends -y \
      gnupg apt-transport-https ca-certificates lsb-release zstd openssh-client \
      wget curl unzip vim-tiny postgresql-${POSTGRES_VERSION}-dbgsym \
    # timescaledb extension
    && if [ "${POSTGRES_VERSION}" -gt "11" ]; then \
         wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | gpg --dearmor -o /etc/apt/trusted.gpg.d/timescaledb.gpg \
         && echo "deb https://packagecloud.io/timescale/timescaledb/debian/ $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/timescaledb.list \
         && apt-get update -o Acquire::CompressionTypes::Order::=gz \
         && apt-get install --no-install-recommends -y timescaledb-2-postgresql-${POSTGRES_VERSION}; \
       fi \
    # citus extension
    && if [ "${POSTGRES_VERSION}" -gt "10" ]; then \
         if [ "${POSTGRES_VERSION}" = "11" ]; then CITUS_VERSION="10.0"; \
         elif [ "${POSTGRES_VERSION}" = "12" ]; then CITUS_VERSION="10.2"; \
         elif [ "${POSTGRES_VERSION}" = "13" ]; then CITUS_VERSION="11.3"; \
         elif [ "${POSTGRES_VERSION}" = "14" ]; then CITUS_VERSION="12.1"; \
         elif [ "${POSTGRES_VERSION}" = "15" ]; then CITUS_VERSION="13.0"; \
         elif [ "${POSTGRES_VERSION}" = "16" ]; then CITUS_VERSION="13.0"; \
         elif [ "${POSTGRES_VERSION}" = "17" ]; then CITUS_VERSION="13.0"; \
         fi \
         && curl -s https://install.citusdata.com/community/deb.sh | bash \
         && apt-get install --no-install-recommends -y postgresql-"${POSTGRES_VERSION}"-citus-"${CITUS_VERSION}"; \
       fi \
    # pg_stat_kcache extension
    && apt-get install --no-install-recommends -y postgresql-${POSTGRES_VERSION}-pg-stat-kcache \
    # pg_wait_sampling extension
    && apt-get install --no-install-recommends -y postgresql-${POSTGRES_VERSION}-pg-wait-sampling \
    # pg_repack extension
    && apt-get install --no-install-recommends -y postgresql-${POSTGRES_VERSION}-repack \
    # pg_cron extension
    && apt-get install --no-install-recommends -y postgresql-${POSTGRES_VERSION}-cron \
    # pgaudit extension
    && apt-get install --no-install-recommends -y postgresql-${POSTGRES_VERSION}-pgaudit \
    # pgvector extension
    && apt-get install --no-install-recommends -y postgresql-${POSTGRES_VERSION}-pgvector \
    # pgvectorscale extension
    && if [ "${POSTGRES_VERSION}" -gt "12" ]; then \
    wget --quiet https://github.com/timescale/pgvectorscale/releases/download/${PGVECTORSCALE_VERSION}/pgvectorscale-${PGVECTORSCALE_VERSION}-pg${POSTGRES_VERSION}-amd64.zip \
    && unzip pgvectorscale-${PGVECTORSCALE_VERSION}-pg${POSTGRES_VERSION}-amd64.zip \
    && dpkg -i pgvectorscale-postgresql-${POSTGRES_VERSION}_${PGVECTORSCALE_VERSION}-Linux_amd64.deb \
    && rm -f pgvectorscale-*.{deb,zip}; \
    fi \
    # postgis extension
    && apt-get install --no-install-recommends -y postgresql-${POSTGRES_VERSION}-postgis-3 \
    # pgrouting extension
    && apt-get install --no-install-recommends -y postgresql-${POSTGRES_VERSION}-pgrouting \
    # partman extension
    && apt-get install --no-install-recommends -y postgresql-${POSTGRES_VERSION}-partman \
    # pgBackRest
    && apt-get install --no-install-recommends -y pgbackrest \
    # WAL-G
    && wget --quiet https://github.com/wal-g/wal-g/releases/download/v"${WALG_VERSION}"/wal-g-pg-ubuntu-20.04-amd64.tar.gz \
      && tar -zxvf wal-g-pg-ubuntu-20.04-amd64.tar.gz \
      && mv wal-g-pg-ubuntu-20.04-amd64 /usr/local/bin/wal-g \
      && rm wal-g-pg-ubuntu-20.04-amd64.tar.gz \
      && wal-g --version \
    # Debug postgres packages
    && dpkg -l | grep postgres \
    # Clean up
    && apt-get autoremove -y --purge gnupg wget unzip \
      && apt-get clean -y autoclean \
      && rm -rf /var/lib/apt/lists/* \
      && rm -rf /var/lib/postgresql/${POSTGRES_VERSION}/

EXPOSE ${POSTGRES_PORT}

CMD ["/pg_start.sh"]
