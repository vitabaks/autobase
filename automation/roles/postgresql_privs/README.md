# Ansible Role: postgresql_privs

Manages PostgreSQL privileges by granting or revoking permissions on databases, schemas, tables, sequences, and functions. The role uses [community.postgresql.postgresql_privs](https://docs.ansible.com/ansible/latest/collections/community/postgresql/postgresql_privs_module.html) to apply entries defined in `postgresql_privs`.

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `postgresql_privs` | `[]` | List of privilege entries to apply. Each item describes a grant/revoke operation. |

### Privilege Entry Format

Each item in `postgresql_privs` supports:

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `role` | Yes | Target role(s) to grant/revoke privileges to (comma-separated allowed by module) | `"app_user"` |
| `db` | Yes | Database to connect to while applying privileges | `"app_db"` |
| `type` | Yes | Object type: database, schema, table, sequence, function, default_privs, etc. | `"table"` |
| `objs` | Yes | Object(s) to which the privileges apply | `"public.my_table"` |
| `privs` | Yes | Privileges to apply (comma-separated string) | `"SELECT,INSERT"` |
| `schema` | No | Schema name when required by object type | `"public"` |
| `target_roles` | Conditional | Required when `type: default_privs` (roles receiving default privileges) | `"app_user"` |
| `state` | No | `present` (grant) or `absent` (revoke). Default: `present` | `"absent"` |

Examples:
- grant SELECT on a table "app_table" in schema "app_schema":
  - `{ role: "app_user", db: "app_db", type: "table", objs: "app_table", schema: "app_schema", privs: "SELECT" }`
- grant SELECT, INSERT, UPDATE on a table "app_table" to role "app_user":
  - `{ role: "app_user", db: "app_db", type: "table", objs: "app_table", privs: "SELECT,INSERT,UPDATE" }`
- grant EXECUTE on a function:
  - `{ role: "app_user", db: "app_db", type: "function", objs: "app_function()", schema: "app_schema", privs: "EXECUTE" }`
- grant ALL on a database "app_db" to role "app_user":
  - `{ role: "app_user", db: "app_db", type: "database", objs: "app_db", privs: "ALL" }`

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
