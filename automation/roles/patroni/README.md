# Ansible Role: patroni

This role installs and configures [Patroni](https://github.com/patroni/patroni), a high-availability solution for PostgreSQL that manages PostgreSQL configuration and provides automatic failover in PostgreSQL clusters.

## Requirements

### Prerequisites

- PostgreSQL server must be installed
- Python 3.6 or higher
- One of the following DCS (Distributed Configuration Store): etcd, Consul, or ZooKeeper

## Role Variables

### Core Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `patroni_cluster_name` | `"postgres-cluster"` | PostgreSQL cluster name (must be unique for each cluster) |
| `patroni_superuser_username` | `"postgres"` | PostgreSQL superuser username |
| `patroni_superuser_password` | `""` | PostgreSQL superuser password (auto-generated if empty) |
| `patroni_replication_username` | `"replicator"` | PostgreSQL replication user username |
| `patroni_replication_password` | `""` | PostgreSQL replication user password (auto-generated if empty) |

### Installation Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `patroni_installation_method` | `"pip"` | Installation method for Patroni (`pip`, `deb`, or `rpm`) |
| `patroni_install_version` | `"latest"` | Patroni version to install when using pip |
| `patroni_pip_package_repo` | `[]` | List of custom Patroni package repository URLs |
| `patroni_pip_requirements_repo` | `[]` | List of custom requirements repository URLs |
| `patroni_deb_package_repo` | `[]` | List of custom DEB package repository URLs |
| `patroni_rpm_package_repo` | `[]` | List of custom RPM package repository URLs |
| `patroni_latest_requirements` | `false` | Use latest requirements.txt from master branch |

### Network Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `patroni_bind_address` | `"{{ bind_address }}"` | IP address for PostgreSQL connections (defaults to bind_address) |

### REST API Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `patroni_restapi_listen_addr` | `"0.0.0.0"` | REST API listen address |
| `patroni_restapi_port` | `8008` | REST API port |
| `patroni_restapi_username` | `"patroni"` | REST API username |
| `patroni_restapi_password` | `""` | REST API password (auto-generated if empty) |
| `patroni_restapi_request_queue_size` | `5` | REST API request queue size |

### Logging Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `patroni_log_destination` | `"logfile"` | Log destination (`logfile` or `stderr`) |
| `patroni_log_dir` | `"/var/log/patroni"` | Patroni log directory |
| `patroni_log_level` | `"warning"` | Patroni log level |
| `patroni_log_traceback_level` | `"error"` | Patroni log traceback level |
| `patroni_log_format` | `"%(asctime)s %(levelname)s: %(message)s"` | Patroni log format |
| `patroni_log_dateformat` | `""` | Patroni log date format |
| `patroni_log_max_queue_size` | `1000` | Maximum log queue size |
| `patroni_log_file_num` | `4` | Number of log files to rotate |
| `patroni_log_file_size` | `25000000` | Log file size in bytes |
| `patroni_log_loggers_patroni_postmaster` | `"warning"` | Log level for patroni.postmaster logger |
| `patroni_log_loggers_urllib3` | `"warning"` | Log level for urllib3 logger |

### Cluster Behavior Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `patroni_ttl` | `30` | TTL for leader key in DCS |
| `patroni_loop_wait` | `10` | Sleep time between runs |
| `patroni_retry_timeout` | `10` | Timeout for retrying failed operations |
| `patroni_master_start_timeout` | `300` | Timeout for master startup |
| `patroni_maximum_lag_on_failover` | `1048576` | Maximum lag in bytes for failover eligibility |
| `patroni_maximum_lag_on_replica` | `"100MB"` | Maximum lag for read-only queries |

### PostgreSQL Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `patroni_postgresql_use_pg_rewind` | `true` | Enable pg_rewind for faster recovery |
| `patroni_remove_data_directory_on_rewind_failure` | `false` | Remove data directory on rewind failure |
| `patroni_remove_data_directory_on_diverged_timelines` | `false` | Remove data directory on diverged timelines |

### Bootstrap Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `patroni_cluster_bootstrap_method` | `"initdb"` | Bootstrap method (`initdb`, `wal-g`, `pgbackrest`, `pg_probackup`) |
| `patroni_create_replica_methods` | `[]` | List of replica creation methods |

### Watchdog Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `patroni_watchdog_mode` | `"automatic"` | Watchdog mode (`automatic`, `off`, `required`) |
| `patroni_watchdog_device` | `"/dev/watchdog"` | Watchdog device path |

### DCS Integration (etcd)

| Variable | Default | Description |
|----------|---------|-------------|
| `patroni_etcd_hosts` | `[]` | List of external etcd servers (host:port) |
| `patroni_etcd_namespace` | `"service"` | etcd namespace prefix |
| `patroni_etcd_username` | `""` | etcd authentication username |
| `patroni_etcd_password` | `""` | etcd authentication password |
| `patroni_etcd_protocol` | `"http"` | etcd protocol (`http` or `https`) |
| `patroni_etcd_cacert` | `"/etc/patroni/tls/etcd/ca.crt"` | etcd CA certificate path |
| `patroni_etcd_cert` | `"/etc/patroni/tls/etcd/server.crt"` | etcd client certificate path |
| `patroni_etcd_key` | `"/etc/patroni/tls/etcd/server.key"` | etcd client key path |

### Standby Cluster Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `patroni_standby_cluster` | `{}` | Standby cluster configuration object |

### Slots Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `patroni_slots` | `[]` | List of replication slot configurations |

### Callbacks Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `patroni_callbacks` | `[]` | List of callback configurations |

### PostgreSQL Directories

| Variable | Default | Description |
|----------|---------|-------------|
| `postgresql_data_dir` | `/var/lib/postgresql/{{ postgresql_version }}/main` | PostgreSQL data directory |
| `postgresql_bin_dir` | `/usr/lib/postgresql/{{ postgresql_version }}/bin` | PostgreSQL binary directory |
| `postgresql_log_dir` | `"/var/log/postgresql"` | PostgreSQL log directory |
| `postgresql_wal_dir` | `""` | Custom WAL directory (optional) |

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Tags

Use these tags to run specific parts of the role:

- `patroni`: Run all Patroni tasks
- `patroni_install`: Install Patroni package only
- `patroni_conf`: Configure Patroni only
- `pip`: Install pip dependencies only
- `pg_hba`: Configure pg_hba.conf only

## License

MIT

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
