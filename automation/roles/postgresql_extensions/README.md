# Ansible Role: postgresql_extensions

This role manages PostgreSQL extensions for databases in a PostgreSQL cluster. It provides automated installation and configuration of PostgreSQL extensions across multiple databases.

## Description

PostgreSQL extensions enhance the functionality of PostgreSQL databases by adding new data types, functions, operators, and other database objects. This role:

- Installs PostgreSQL extensions on specified databases
- Supports custom schema placement for extensions
- Handles multiple extensions across multiple databases
- Integrates with Patroni-managed PostgreSQL clusters
- Skips execution on standby clusters to prevent conflicts

## Requirements

### Prerequisites

- PostgreSQL server must be installed and running
- Target databases must exist before installing extensions
- Extensions must be available in the PostgreSQL installation
- User must have sufficient privileges to install extensions

### Operating System Support

- **Debian/Ubuntu**: 18.04, 20.04, 22.04, 24.04
- **RHEL/CentOS/Rocky/AlmaLinux**: 8, 9
- **Amazon Linux**: 2023

## Role Variables

This role uses variables defined in the `vitabaks.autobase.common` role.

### Extension Configuration

```yaml
# List of extensions to install
postgresql_extensions:
  - {db: "myapp", ext: "pg_stat_statements"}
  - {db: "myapp", ext: "pgcrypto", schema: "extensions"}
  - {db: "analytics", ext: "timescaledb"}
  - {db: "analytics", ext: "postgis"}
```

### Database Connection Variables (from common role)

```yaml
# PostgreSQL connection settings
postgresql_port: 5432
patroni_superuser_username: "postgres" 
patroni_superuser_password: ""  # Auto-generated if empty

# Standby cluster configuration
patroni_standby_cluster:
  host: ""  # If set, extensions won't be installed on standby
```

### Extension Variable Structure

Each extension entry supports the following parameters:

- **db** (required): Target database name
- **ext** (required): PostgreSQL extension name
- **schema** (optional): Target schema name (defaults to "public")

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Example Playbook

### Basic Extension Installation

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    postgresql_extensions:
      - {db: "myapp", ext: "uuid-ossp"}
      - {db: "myapp", ext: "pg_stat_statements"}
      - {db: "reporting", ext: "pgcrypto"}
  roles:
    - vitabaks.autobase.postgresql_databases  # Ensure databases exist first
    - vitabaks.autobase.postgresql_extensions
```

### Advanced Extensions with Custom Schemas

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    postgresql_extensions:
      # Core extensions in public schema
      - {db: "ecommerce", ext: "uuid-ossp"}
      - {db: "ecommerce", ext: "pgcrypto"}
      
      # Extensions in custom schema
      - {db: "ecommerce", ext: "pg_stat_statements", schema: "monitoring"}
      - {db: "ecommerce", ext: "pg_buffercache", schema: "monitoring"}
      
      # GIS extensions
      - {db: "mapping", ext: "postgis"}
      - {db: "mapping", ext: "postgis_topology"}
      
      # Time-series extensions  
      - {db: "timeseries", ext: "timescaledb"}
      
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.postgresql_databases
    - vitabaks.autobase.postgresql_extensions
```

### Full Stack Deployment

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    # Database definitions
    postgresql_databases:
      - {db: "app_prod", owner: "app_user", encoding: "UTF8", lc_collate: "en_US.UTF-8", lc_ctype: "en_US.UTF-8"}
      - {db: "analytics", owner: "analytics_user", encoding: "UTF8", lc_collate: "en_US.UTF-8", lc_ctype: "en_US.UTF-8"}
      
    # Extension definitions
    postgresql_extensions:
      # Production app extensions
      - {db: "app_prod", ext: "uuid-ossp"}
      - {db: "app_prod", ext: "pgcrypto"}
      - {db: "app_prod", ext: "pg_trgm"}
      
      # Analytics extensions
      - {db: "analytics", ext: "pg_stat_statements"}
      - {db: "analytics", ext: "timescaledb"}
      - {db: "analytics", ext: "pg_partman", schema: "partman"}
      
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.postgresql_databases
    - vitabaks.autobase.postgresql_extensions
```

## Common PostgreSQL Extensions

This role can install any available PostgreSQL extension. Common extensions include:

### Core Extensions
- **uuid-ossp**: UUID generation functions
- **pgcrypto**: Cryptographic functions
- **pg_trgm**: Trigram matching for text search
- **pg_stat_statements**: Query execution statistics
- **pg_buffercache**: Buffer cache inspection

### Specialized Extensions
- **timescaledb**: Time-series database functionality
- **postgis**: Geographic information system (GIS) objects
- **pg_partman**: Partition management
- **pg_repack**: Table/index reorganization without locks
- **pg_audit**: Audit logging

### Performance Extensions
- **pg_stat_statements**: Track planning and execution statistics
- **auto_explain**: Automatic query plan logging
- **pg_qualstats**: Query predicate statistics

## Behavior Notes

- Extensions are installed only on the primary cluster (not on standby clusters)
- Installation errors are ignored to handle cases where extensions are already present
- Extensions are installed in the specified schema or "public" schema by default
- The role connects locally to PostgreSQL using superuser credentials

## Error Handling

- Uses `ignore_errors: true` to handle already-installed extensions gracefully
- Skips execution on standby clusters automatically
- Requires databases to exist before extension installation

## Tags

Use these tags to run specific parts of the role:

- `postgresql_extensions`: Install/configure PostgreSQL extensions

### Example with Tags

```bash
# Install extensions only
ansible-playbook playbook.yml --tags postgresql_extensions
```

## Integration with Other Roles

This role is typically used in conjunction with:

1. **postgresql_databases**: Create databases before installing extensions
2. **postgresql_users**: Create users who may need access to extension functions
3. **patroni**: Manage the PostgreSQL cluster

## License

BSD

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
