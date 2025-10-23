# Ansible Role: postgresql_extensions

This role manages extensions for databases in a PostgreSQL cluster, providing automated installation and configuration of extensions across multiple databases.

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `postgresql_extensions` | `[]` | List of extensions to install with database and schema specification |

### Example

```yaml
postgresql_extensions:
  - { ext: "pg_stat_statements", db: "postgres" }
  - { ext: "pg_stat_statements", db: "app_db" }
  - { ext: "pg_cron", db: "app_db" }
```

Note: See the detailed [documentation](https://autobase.tech/docs/extensions/install) for installing extensions.

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
