# Ansible Role: postgresql_databases

This role manages databases within a PostgreSQL cluster, providing automated creation and configuration of databases with proper ownership, encoding, and locale settings.

Based on [community.postgresql.postgresql_db](https://docs.ansible.com/ansible/latest/collections/community/postgresql/postgresql_db_module.html) module.

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `postgresql_databases` | `[]` | List of databases to create with configuration parameters |

### Example:

```yaml
postgresql_databases:
  - db: "app_db"
    owner: "app_user"
    encoding: "UTF8"
    lc_collate: "en_US.UTF-8"
    lc_ctype: "en_US.UTF-8"
    conn_limit: "10" # optional
```

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
