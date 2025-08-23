# Ansible Role: postgresql_users

This role manages PostgreSQL database users within a PostgreSQL cluster, providing automated creation and configuration of users with proper role attributes, passwords, and role memberships.

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
- Sufficient privileges to create users and grant roles
- Target roles must exist if granting role memberships

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `postgresql_users` | `[]` | List of users to create with configuration parameters |
| `postgresql_port` | `5432` | PostgreSQL connection port |
| `patroni_superuser_username` | `"postgres"` | PostgreSQL superuser username |
| `patroni_superuser_password` | `""` | PostgreSQL superuser password |

### User Configuration Format

Each user entry supports the following parameters:

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `name` | Yes | Username for the PostgreSQL user | `"app_user"` |
| `password` | No | User password (encrypted automatically) | `"secure_password123"` |
| `flags` | No | Role attributes (comma-separated) | `"CREATEDB,NOSUPERUSER"` |
| `role` | No | Additional role to grant to user | `"pg_read_all_data"` |

### Common Role Attributes

| Flag | Description |
|------|-------------|
| `SUPERUSER` | User has superuser privileges |
| `CREATEDB` | User can create databases |
| `CREATEROLE` | User can create other users |
| `REPLICATION` | User can perform replication |
| `LOGIN` | User can log in (default) |
| `NOLOGIN` | User cannot log in |
- **flags** (required): PostgreSQL role attributes (comma-separated)
- **role** (optional): PostgreSQL role to grant membership to this user

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## PostgreSQL Role Flags

### Common Role Attributes

- **SUPERUSER** / **NOSUPERUSER**: Superuser privileges
- **CREATEDB** / **NOCREATEDB**: Can create databases
- **CREATEROLE** / **NOCREATEROLE**: Can create other roles
- **LOGIN** / **NOLOGIN**: Can log in (default: LOGIN)
- **REPLICATION** / **NOREPLICATION**: Can initiate replication
- **BYPASSRLS** / **NOBYPASSRLS**: Can bypass row level security
- **INHERIT** / **NOINHERIT**: Inherit privileges from granted roles (default: INHERIT)

### Useful Combinations

```yaml
# Application user
flags: "CREATEDB,NOSUPERUSER"

# Read-only user
flags: "NOSUPERUSER,NOINHERIT"

# Admin user
flags: "SUPERUSER,CREATEDB,CREATEROLE"

# Replication user
flags: "REPLICATION,LOGIN,NOSUPERUSER"

# Service account (no login)
flags: "NOLOGIN,NOSUPERUSER"
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
