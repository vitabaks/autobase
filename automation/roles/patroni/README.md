# Ansible Role: patroni

This role installs and configures [Patroni](https://github.com/patroni/patroni), a high-availability solution for PostgreSQL that manages PostgreSQL configuration and provides automatic failover in PostgreSQL clusters.

## Requirements

### Operating System Support

- **Debian**: 11, 12, 13
- **Ubuntu**: 22.04, 24.04
- **CentOS Stream**: 9, 10
- **Oracle Linux**: 8, 9, 10
- **Rocky Linux**: 8, 9, 10
- **AlmaLinux**: 8, 9, 10

### Dependencies

- PostgreSQL server must be installed
- Python 3.6 or higher
- One of the following DCS (Distributed Configuration Store): etcd, Consul, or ZooKeeper

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `patroni_installation_method` | `"pip"` | Installation method for Patroni (`pip` or `packages`) |
| `patroni_install_version` | `"latest"` | Patroni version to install when using pip |
| `patroni_pip_package_repo` | `""` | Custom package repository URL |
| `patroni_pip_requirements_repo` | `""` | Custom requirements repository URL |
| `patroni_latest_requirements` | `false` | Use latest requirements.txt from master branch |
| `patroni_cluster_name` | `"postgres-cluster"` | PostgreSQL cluster name |
| `patroni_superuser_username` | `"postgres"` | PostgreSQL superuser username |
| `patroni_superuser_password` | `""` | PostgreSQL superuser password (auto-generated if empty) |
| `patroni_replication_username` | `"replicator"` | PostgreSQL replication user username |
| `patroni_replication_password` | `""` | PostgreSQL replication user password (auto-generated if empty) |
| `patroni_log_destination` | `"logfile"` | Patroni log destination (`logfile` or `syslog`) |
| `patroni_log_dir` | `"/var/log/patroni"` | Patroni log directory |
| `patroni_log_level` | `"INFO"` | Patroni log level |
| `patroni_log_format` | `"%(asctime)s %(levelname)s: %(message)s"` | Patroni log format |
| `patroni_log_dateformat` | `""` | Patroni log date format |
| `patroni_log_max_queue_size` | `1000` | Maximum log queue size |
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
