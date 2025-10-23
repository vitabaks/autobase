# Ansible Role: postgresql_schemas

Creates and manages PostgreSQL schemas in specified databases. Ensures schemas exist with the desired owner, using [community.postgresql.postgresql_schema](https://docs.ansible.com/ansible/latest/collections/community/postgresql/postgresql_schema_module.html) module.

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `postgresql_schemas` | `[]` | List of schema definitions to apply. Each item typically includes: schema (name), db (database), owner (role). |

### Example:

```yaml
postgresql_schemas:
  - { schema: "app_schema1", db: "app_db", owner: "app_user" }
  - { schema: "app_schema2", db: "app_db", owner: "app_user" }
```

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
