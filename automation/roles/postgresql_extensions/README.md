# Ansible Role: postgresql_extensions

This role manages PostgreSQL extensions for databases in a PostgreSQL cluster, providing automated installation and configuration of extensions across multiple databases.

## Requirements

### Operating System Support

- **Debian**: 11, 12, 13
- **Ubuntu**: 22.04, 24.04
- **CentOS Stream**: 9, 10
- **Oracle Linux**: 8, 9, 10
- **Rocky Linux**: 8, 9, 10
- **AlmaLinux**: 8, 9, 10

### Prerequisites

- PostgreSQL server must be installed and running
- Target databases must exist before installing extensions
- Extensions must be available in the PostgreSQL installation
- User must have sufficient privileges to install extensions

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `postgresql_extensions` | `[]` | List of extensions to install with database and schema specification |
| `postgresql_port` | `5432` | PostgreSQL connection port |
| `patroni_superuser_username` | `"postgres"` | PostgreSQL superuser username |
| `patroni_superuser_password` | `""` | PostgreSQL superuser password |

### Extension Configuration Format

Each extension entry supports the following parameters:

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `db` | Yes | Target database name | `"myapp"` |
| `ext` | Yes | Extension name | `"pg_stat_statements"` |
| `schema` | No | Schema to install extension in | `"extensions"` |

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Tags

Use these tags to run specific parts of the role:

- `postgresql_extensions`: Install/configure PostgreSQL extensions

## License

MIT

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
