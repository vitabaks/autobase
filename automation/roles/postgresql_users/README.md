# Ansible Role: postgresql_users

This role manages PostgreSQL database users within a PostgreSQL cluster. It provides automated creation and configuration of users with proper role attributes, passwords, and role memberships.

## Description

PostgreSQL users (roles) are essential for database security and access control. This role:

- Creates PostgreSQL users with specified role attributes
- Sets encrypted passwords for user authentication
- Manages role memberships and grants
- Supports various PostgreSQL role flags (SUPERUSER, CREATEDB, etc.)
- Integrates with Patroni-managed PostgreSQL clusters
- Skips execution on standby clusters to prevent conflicts

## Requirements

### Prerequisites

- PostgreSQL server must be installed and running
- Sufficient privileges to create users and grant roles
- Target roles must exist if granting role memberships

### Operating System Support

- **Debian**: 11, 12, 13
- **Ubuntu**: 22.04, 24.04
- **CentOS Stream**: 9, 10
- **Oracle Linux**: 8, 9, 10
- **Rocky Linux**: 8, 9, 10
- **AlmaLinux**: 8, 9, 10

- **Debian/Ubuntu**: 18.04, 20.04, 22.04, 24.04
- **RHEL/CentOS/Rocky/AlmaLinux**: 8, 9
- **Amazon Linux**: 2023

## Role Variables

This role uses variables defined in the `vitabaks.autobase.common` role.

### User Configuration

```yaml
# List of users to create
postgresql_users:
  - {name: "app_user", password: "secure_password123", flags: "CREATEDB,NOSUPERUSER"}
  - {name: "readonly_user", password: "readonly_pass456", flags: "NOSUPERUSER", role: "pg_read_all_data"}
  - {name: "admin_user", password: "admin_pass789", flags: "SUPERUSER,CREATEDB,CREATEROLE"}
  - {name: "replication_user", password: "repl_pass000", flags: "REPLICATION,LOGIN"}
```

### Database Connection Variables (from common role)

```yaml
# PostgreSQL connection settings
postgresql_port: 5432
patroni_superuser_username: "postgres"
patroni_superuser_password: ""  # Auto-generated if empty

# Standby cluster configuration
patroni_standby_cluster:
  host: ""  # If set, users won't be created on standby
```

### User Variable Structure

Each user entry supports the following parameters:

- **name** (required): Username for the PostgreSQL user
- **password** (optional): User password (encrypted automatically)
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

## Example Playbook

### Basic User Creation

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    postgresql_users:
      - {name: "webapp_user", password: "webapp_secret123", flags: "CREATEDB,NOSUPERUSER"}
      - {name: "readonly_user", password: "readonly_secret456", flags: "NOSUPERUSER"}
      - {name: "admin_user", password: "admin_secret789", flags: "SUPERUSER"}
  roles:
    - vitabaks.autobase.postgresql_users
```

### Advanced User Configuration with Role Memberships

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    postgresql_users:
      # Application users
      - name: "ecommerce_app"
        password: "{{ vault_ecommerce_password }}"
        flags: "CREATEDB,NOSUPERUSER"
        
      - name: "ecommerce_readonly"
        password: "{{ vault_readonly_password }}"
        flags: "NOSUPERUSER"
        role: "pg_read_all_data"
        
      # Administrative users
      - name: "dba_user"
        password: "{{ vault_dba_password }}"
        flags: "SUPERUSER,CREATEDB,CREATEROLE"
        
      - name: "backup_user"
        password: "{{ vault_backup_password }}"
        flags: "REPLICATION,LOGIN,NOSUPERUSER"
        
      # Service accounts
      - name: "monitoring_user"
        password: "{{ vault_monitoring_password }}"
        flags: "NOSUPERUSER"
        role: "pg_monitor"
        
      - name: "scheduler_user"
        password: "{{ vault_scheduler_password }}"
        flags: "NOLOGIN,NOSUPERUSER"
        
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.postgresql_users
```

### Development Environment Setup

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    postgresql_users:
      # Development team users
      - name: "dev_alice"
        password: "dev_password123"
        flags: "CREATEDB,NOSUPERUSER"
        
      - name: "dev_bob"
        password: "dev_password456"
        flags: "CREATEDB,NOSUPERUSER"
        
      # Testing users
      - name: "test_user"
        password: "test_password789"
        flags: "NOSUPERUSER"
        
      - name: "performance_test"
        password: "perf_password000"
        flags: "NOSUPERUSER,NOINHERIT"
        role: "pg_read_all_stats"
        
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.postgresql_users
```

## Built-in PostgreSQL Roles

PostgreSQL provides several built-in roles that can be granted to users:

### Monitoring Roles
- **pg_monitor**: Read/execute various monitoring views and functions
- **pg_read_all_settings**: Read all configuration settings
- **pg_read_all_stats**: Read all statistics views
- **pg_stat_scan_tables**: Execute monitoring functions that may take long locks

### Data Access Roles  
- **pg_read_all_data**: Read all data (tables, views, sequences)
- **pg_write_all_data**: Write all data
- **pg_read_server_files**: Read server files
- **pg_write_server_files**: Write server files
- **pg_execute_server_program**: Execute programs on the server

### Administrative Roles
- **pg_signal_backend**: Signal other backends (cancel query, terminate)
- **pg_checkpoint**: Execute CHECKPOINT command

## Security Best Practices

### Password Management
- Use strong, unique passwords for each user
- Store sensitive passwords in Ansible Vault
- Rotate passwords regularly
- Consider using certificate-based authentication

### Role Assignment
- Follow principle of least privilege
- Use role-based access control
- Regularly audit user permissions
- Remove unused accounts

### Example with Ansible Vault

```bash
# Create vault file
ansible-vault create group_vars/postgres_cluster/vault.yml

# Add encrypted passwords
vault_app_password: "secure_app_password_123"
vault_readonly_password: "secure_readonly_password_456"
```

```yaml
# Use vault variables in playbook
postgresql_users:
  - {name: "app_user", password: "{{ vault_app_password }}", flags: "CREATEDB,NOSUPERUSER"}
  - {name: "readonly_user", password: "{{ vault_readonly_password }}", flags: "NOSUPERUSER"}
```

## Behavior Notes

- Users are created only on the primary cluster (not on standby clusters)
- Passwords are automatically encrypted using PostgreSQL's built-in encryption
- User creation errors are ignored to handle existing users gracefully
- Role memberships are granted after user creation
- Empty role assignments are skipped

## Error Handling

- Uses `ignore_errors: true` to handle already-existing users gracefully
- Skips execution on standby clusters automatically  
- Validates role assignments before attempting to grant them

## Tags

Use these tags to run specific parts of the role:

- `postgresql_users`: Create/configure PostgreSQL users

### Example with Tags

```bash
# Create users only
ansible-playbook playbook.yml --tags postgresql_users
```

## Integration with Other Roles

This role is typically used in conjunction with:

1. **postgresql_databases**: Create databases owned by these users
2. **postgresql_privs**: Grant specific database privileges to users
3. **patroni**: Manage the PostgreSQL cluster

### Recommended Order

```yaml
roles:
  - vitabaks.autobase.common
  - vitabaks.autobase.patroni
  - vitabaks.autobase.postgresql_users      # 1. Create users first
  - vitabaks.autobase.postgresql_databases  # 2. Create databases (with user as owner)
  - vitabaks.autobase.postgresql_privs      # 3. Grant specific privileges
```

## Common User Patterns

### Application Stack
```yaml
postgresql_users:
  - {name: "app_owner", password: "...", flags: "CREATEDB,NOSUPERUSER"}        # Database owner
  - {name: "app_writer", password: "...", flags: "NOSUPERUSER"}               # Read-write access
  - {name: "app_reader", password: "...", flags: "NOSUPERUSER", role: "pg_read_all_data"}  # Read-only access
```

### Administrative Stack
```yaml
postgresql_users:
  - {name: "dba", password: "...", flags: "SUPERUSER"}                        # Database administrator
  - {name: "backup", password: "...", flags: "REPLICATION,NOSUPERUSER"}       # Backup operations
  - {name: "monitor", password: "...", flags: "NOSUPERUSER", role: "pg_monitor"}  # Monitoring
```

## License

MIT

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
