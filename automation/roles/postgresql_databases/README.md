# Ansible Role: postgresql_databases

This role manages PostgreSQL databases within a PostgreSQL cluster, providing automated creation and configuration of databases with proper ownership, encoding, and locale settings.

## Requirements

### Prerequisites

- PostgreSQL server must be installed and running
- Database owner users must exist before database creation
- Sufficient privileges to create databases

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `postgresql_databases` | `[]` | List of databases to create with configuration parameters |
| `postgresql_port` | `5432` | PostgreSQL connection port |
| `patroni_superuser_username` | `"postgres"` | PostgreSQL superuser username |
| `patroni_superuser_password` | `""` | PostgreSQL superuser password |

### Database Configuration Format

Each database entry supports the following parameters:

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `db` | Yes | Database name | `"myapp"` |
| `owner` | Yes | Database owner username | `"app_user"` |
| `encoding` | Yes | Character encoding | `"UTF8"` |
| `lc_collate` | Yes | Locale for collation | `"en_US.UTF-8"` |
| `lc_ctype` | Yes | Locale for character classification | `"en_US.UTF-8"` |
| `template` | No | Template database to copy from | `"template0"` |
| `conn_limit` | No | Maximum concurrent connections | `100` |

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Tags

Use these tags to run specific parts of the role:

- `postgresql_databases`: Create/configure PostgreSQL databases

## License

MIT

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
