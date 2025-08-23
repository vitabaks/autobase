# Ansible Role: pgbouncer

This role installs and configures [PgBouncer](https://www.pgbouncer.org/), a lightweight connection pooler for PostgreSQL that reduces resource consumption by pooling and reusing database connections.

## Requirements

### Operating System Support

- **Debian**: 11, 12, 13
- **Ubuntu**: 22.04, 24.04
- **CentOS Stream**: 9, 10
- **Oracle Linux**: 8, 9, 10
- **Rocky Linux**: 8, 9, 10
- **AlmaLinux**: 8, 9, 10

### Prerequisites

- PostgreSQL server must be installed and accessible
- Target databases and users should exist
- Network connectivity between PgBouncer and PostgreSQL servers

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `pgbouncer_listen_port` | `6432` | Port for PgBouncer to listen on |
| `pgbouncer_listen_addr` | `"*"` | IP address for PgBouncer to bind to |
| `pgbouncer_max_client_conn` | `100` | Maximum number of client connections |
| `pgbouncer_default_pool_size` | `20` | Default pool size per database |
| `pgbouncer_min_pool_size` | `5` | Minimum pool size per database |
| `pgbouncer_reserve_pool_size` | `5` | Reserve pool size for emergency |
| `pgbouncer_processes` | `1` | Number of PgBouncer processes to run |
| `pgbouncer_conf_dir` | `"/etc/pgbouncer"` | PgBouncer configuration directory |
| `pgbouncer_log_dir` | `"/var/log/pgbouncer"` | PgBouncer log directory |
| `pgbouncer_pid_file` | `"/var/run/pgbouncer/pgbouncer.pid"` | PID file location |
| `pgbouncer_auth_type` | `"md5"` | Authentication method (`md5`, `plain`, `cert`, `pam`) |
| `pgbouncer_auth_file` | `"/etc/pgbouncer/userlist.txt"` | User authentication file |
| `pgbouncer_admin_users` | `["postgres"]` | List of admin users |
| `pgbouncer_stats_users` | `["postgres"]` | List of users who can view statistics |

### Connection Pooling

```yaml
# Pool modes: session, transaction, statement
pgbouncer_pool_mode: "transaction"

# Connection timeouts (in seconds)
pgbouncer_server_connect_timeout: 15
pgbouncer_server_login_retry: 15
pgbouncer_client_login_timeout: 60
pgbouncer_client_idle_timeout: 0
pgbouncer_server_idle_timeout: 600
pgbouncer_server_lifetime: 3600
```

### Database Configuration (from common role)

```yaml
# PostgreSQL connection details
postgresql_port: 5432
patroni_superuser_username: "postgres"
patroni_superuser_password: ""

# Databases to configure in PgBouncer
pgbouncer_databases: []
  # Configured automatically based on postgresql_databases
```

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```


## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Tags

## License

MIT

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
