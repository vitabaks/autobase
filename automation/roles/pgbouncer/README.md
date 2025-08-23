# Ansible Role: pgbouncer

This role installs and configures [PgBouncer](https://www.pgbouncer.org/), a lightweight connection pooler for PostgreSQL. PgBouncer reduces resource consumption by pooling and reusing database connections.

## Description

PgBouncer is a PostgreSQL connection pooler that sits between client applications and PostgreSQL databases, managing database connections efficiently. This role:

- Installs PgBouncer from system packages
- Configures connection pooling settings
- Sets up user authentication and database mappings  
- Manages multiple PgBouncer processes for load distribution
- Configures systemd services for service management
- Sets up log rotation and directory permissions
- Integrates with Patroni-managed PostgreSQL clusters

## Requirements

### Prerequisites

- PostgreSQL server must be installed and accessible
- Target databases and users should exist
- Network connectivity between PgBouncer and PostgreSQL servers

### Operating System Support

- **Debian/Ubuntu**: 18.04, 20.04, 22.04, 24.04
- **RHEL/CentOS/Rocky/AlmaLinux**: 8, 9
- **Amazon Linux**: 2023

## Role Variables

This role uses variables defined in the `vitabaks.autobase.common` role.

### Connection and Networking

```yaml
# PgBouncer listening configuration
pgbouncer_listen_port: 6432
pgbouncer_listen_addr: "*"
pgbouncer_listen_addr: "{{ bind_address | default('*') }}"

# Network and connection limits  
pgbouncer_max_client_conn: 100
pgbouncer_default_pool_size: 20
pgbouncer_min_pool_size: 5
pgbouncer_reserve_pool_size: 5
```

### Process Management

```yaml
# Number of PgBouncer processes to run
pgbouncer_processes: 1

# Configuration directories
pgbouncer_conf_dir: "/etc/pgbouncer"
pgbouncer_log_dir: "/var/log/pgbouncer"
pgbouncer_pid_file: "/var/run/pgbouncer/pgbouncer.pid"
```

### Authentication and Security

```yaml
# Authentication settings
pgbouncer_auth_type: "md5"     # or "plain", "cert", "pam"
pgbouncer_auth_file: "{{ pgbouncer_conf_dir }}/userlist.txt"
pgbouncer_auth_query: ""       # Custom auth query if needed

# Admin access
pgbouncer_admin_users: ["postgres"]
pgbouncer_stats_users: ["postgres"]
```

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

## Example Playbook

### Basic PgBouncer Setup

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    pgbouncer_listen_port: 6432
    pgbouncer_pool_mode: "transaction"
    pgbouncer_max_client_conn: 200
    pgbouncer_default_pool_size: 25
  roles:
    - vitabaks.autobase.pgbouncer
```

### High-Performance Configuration

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    # Multiple processes for load distribution
    pgbouncer_processes: 4
    
    # High-capacity settings
    pgbouncer_listen_port: 6432
    pgbouncer_pool_mode: "transaction"
    pgbouncer_max_client_conn: 1000
    pgbouncer_default_pool_size: 100
    pgbouncer_min_pool_size: 10
    pgbouncer_reserve_pool_size: 20
    
    # Optimized timeouts
    pgbouncer_server_connect_timeout: 10
    pgbouncer_client_idle_timeout: 300
    pgbouncer_server_idle_timeout: 300
    pgbouncer_server_lifetime: 7200
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.pgbouncer
```

### Development Environment with Session Pooling

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    # Session-level pooling for development
    pgbouncer_pool_mode: "session"
    pgbouncer_max_client_conn: 50
    pgbouncer_default_pool_size: 10
    
    # Relaxed timeouts for debugging
    pgbouncer_client_idle_timeout: 0
    pgbouncer_server_idle_timeout: 0
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.pgbouncer
```

### Full Stack with Custom Authentication

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    # Custom authentication
    pgbouncer_auth_type: "md5"
    pgbouncer_admin_users: ["postgres", "dba_user"]
    pgbouncer_stats_users: ["postgres", "monitoring_user"]
    
    # Network configuration
    pgbouncer_listen_addr: "{{ ansible_default_ipv4.address }}"
    pgbouncer_listen_port: 6432
    
    # Performance tuning
    pgbouncer_pool_mode: "transaction"
    pgbouncer_max_client_conn: 500
    pgbouncer_default_pool_size: 50
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.postgresql_users
    - vitabaks.autobase.postgresql_databases
    - vitabaks.autobase.pgbouncer
```

## Pool Modes

PgBouncer supports three pooling modes:

### Session Level
```yaml
pgbouncer_pool_mode: "session"
```
- Connection held for entire client session
- Most compatible with all PostgreSQL features
- Lowest connection efficiency

### Transaction Level (Recommended)
```yaml
pgbouncer_pool_mode: "transaction"
```
- Connection returned after each transaction
- Good balance of compatibility and efficiency
- Cannot use session-level features (prepared statements, etc.)

### Statement Level
```yaml
pgbouncer_pool_mode: "statement"
```
- Connection returned after each statement
- Highest connection efficiency
- Very limited compatibility (no transactions spanning statements)

## Authentication Methods

### MD5 Authentication (Recommended)
```yaml
pgbouncer_auth_type: "md5"
```

### Plain Text
```yaml
pgbouncer_auth_type: "plain"
```

### Certificate Authentication
```yaml
pgbouncer_auth_type: "cert"
```

### PAM Authentication
```yaml
pgbouncer_auth_type: "pam"
```

## Configuration Templates

This role provides the following templates:

- **pgbouncer.ini.j2**: Main PgBouncer configuration file
- **userlist.txt.j2**: Authentication user list
- **pgbouncer.service.j2**: Systemd service definition

## Monitoring and Administration

### Admin Console Commands

Connect to PgBouncer admin console:
```bash
psql -h localhost -p 6432 -U postgres pgbouncer
```

Common admin commands:
```sql
SHOW POOLS;      -- Show pool statistics
SHOW CLIENTS;    -- Show client connections
SHOW SERVERS;    -- Show server connections
SHOW DATABASES;  -- Show database configuration
RELOAD;          -- Reload configuration
PAUSE;          -- Pause all connections
RESUME;         -- Resume connections
```

### Log Management

- Logs are stored in `/var/log/pgbouncer/`
- Log rotation is configured automatically via logrotate
- Log level can be adjusted in configuration

## Performance Tuning

### Connection Pool Sizing

```yaml
# For high-traffic OLTP applications
pgbouncer_default_pool_size: 100
pgbouncer_min_pool_size: 20
pgbouncer_reserve_pool_size: 30

# For low-traffic applications  
pgbouncer_default_pool_size: 10
pgbouncer_min_pool_size: 2
pgbouncer_reserve_pool_size: 5
```

### Timeout Optimization

```yaml
# Fast-responding applications
pgbouncer_server_connect_timeout: 5
pgbouncer_client_idle_timeout: 300

# Slow or batch applications
pgbouncer_server_connect_timeout: 30
pgbouncer_client_idle_timeout: 3600
```

## Multi-Process Setup

For high-load scenarios, run multiple PgBouncer processes:

```yaml
pgbouncer_processes: 4  # Creates pgbouncer, pgbouncer-2, pgbouncer-3, pgbouncer-4
```

Each process will:
- Listen on the same port (using SO_REUSEPORT)
- Have its own configuration file
- Run as a separate systemd service
- Handle connections independently

## Handlers

- **restart pgbouncer**: Restart all PgBouncer processes
- **reload pgbouncer**: Reload configuration without dropping connections

## Tags

Use these tags to run specific parts of the role:

- `pgbouncer`: Run all PgBouncer tasks
- `pgbouncer_install`: Install PgBouncer package only
- `pgbouncer_conf`: Configure PgBouncer only  
- `pgbouncer_service`: Manage PgBouncer service only

### Example with Tags

```bash
# Install PgBouncer only
ansible-playbook playbook.yml --tags pgbouncer_install

# Reconfigure PgBouncer only
ansible-playbook playbook.yml --tags pgbouncer_conf
```

## Integration with HAProxy

When used with HAProxy for load balancing:

```yaml
# HAProxy backend configuration
haproxy_listen_port:
  master: 5000        # Points to primary PgBouncer
  replicas: 5001      # Points to replica PgBouncer instances

# PgBouncer configuration  
pgbouncer_listen_port: 6432  # HAProxy connects here
```

## Common Issues and Solutions

### Connection Limit Reached
- Increase `pgbouncer_max_client_conn`
- Tune `pgbouncer_default_pool_size`
- Consider adding more processes

### Authentication Failures
- Verify user exists in `userlist.txt`
- Check `pgbouncer_auth_type` matches PostgreSQL configuration
- Ensure passwords are correctly hashed

### Performance Issues
- Switch to `transaction` pool mode if using `session`
- Increase pool sizes for high-traffic applications
- Consider multiple PgBouncer processes

## License

BSD

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
