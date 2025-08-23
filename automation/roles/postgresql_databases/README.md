# Ansible Role: postgresql_databases

This role manages PostgreSQL databases within a PostgreSQL cluster. It provides automated creation and configuration of databases with proper ownership, encoding, and locale settings.

## Description

PostgreSQL databases are logical containers for organizing data, users, and objects within a PostgreSQL cluster. This role:

- Creates PostgreSQL databases with specified configurations
- Sets proper ownership and permissions
- Configures encoding, collation, and character type settings
- Supports connection limits and template selection
- Integrates with Patroni-managed PostgreSQL clusters
- Skips execution on standby clusters to prevent conflicts

## Requirements

### Prerequisites

- PostgreSQL server must be installed and running
- Database owner users must exist before database creation
- Sufficient privileges to create databases

### Operating System Support

- **Debian/Ubuntu**: 18.04, 20.04, 22.04, 24.04
- **RHEL/CentOS/Rocky/AlmaLinux**: 8, 9
- **Amazon Linux**: 2023

## Role Variables

This role uses variables defined in the `vitabaks.autobase.common` role.

### Database Configuration

```yaml
# List of databases to create
postgresql_databases:
  - {db: "myapp", owner: "app_user", encoding: "UTF8", lc_collate: "en_US.UTF-8", lc_ctype: "en_US.UTF-8"}
  - {db: "reporting", owner: "report_user", encoding: "UTF8", lc_collate: "en_US.UTF-8", lc_ctype: "en_US.UTF-8", conn_limit: 100}
  - {db: "test_db", owner: "test_user", encoding: "UTF8", lc_collate: "C", lc_ctype: "C", template: "template1"}
```

### Database Connection Variables (from common role)

```yaml
# PostgreSQL connection settings
postgresql_port: 5432
patroni_superuser_username: "postgres"
patroni_superuser_password: ""  # Auto-generated if empty

# Standby cluster configuration
patroni_standby_cluster:
  host: ""  # If set, databases won't be created on standby
```

### Database Variable Structure

Each database entry supports the following parameters:

- **db** (required): Database name
- **owner** (required): Database owner username
- **encoding** (required): Character encoding (e.g., "UTF8", "LATIN1")
- **lc_collate** (required): Locale for collation (e.g., "en_US.UTF-8", "C")
- **lc_ctype** (required): Locale for character classification (e.g., "en_US.UTF-8", "C")
- **template** (optional): Template database to copy from (defaults to "template0")
- **conn_limit** (optional): Maximum concurrent connections to the database

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Example Playbook

### Basic Database Creation

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    postgresql_databases:
      - {db: "webapp", owner: "webapp_user", encoding: "UTF8", lc_collate: "en_US.UTF-8", lc_ctype: "en_US.UTF-8"}
      - {db: "analytics", owner: "analytics_user", encoding: "UTF8", lc_collate: "en_US.UTF-8", lc_ctype: "en_US.UTF-8"}
  roles:
    - vitabaks.autobase.postgresql_users      # Create users first
    - vitabaks.autobase.postgresql_databases  # Then create databases
```

### Advanced Database Configuration

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    postgresql_databases:
      # Production database with connection limit
      - db: "ecommerce_prod"
        owner: "ecommerce_user"
        encoding: "UTF8"
        lc_collate: "en_US.UTF-8"
        lc_ctype: "en_US.UTF-8"
        conn_limit: 200
        
      # Development database using template1
      - db: "ecommerce_dev"
        owner: "ecommerce_dev_user"  
        encoding: "UTF8"
        lc_collate: "en_US.UTF-8"
        lc_ctype: "en_US.UTF-8"
        template: "template1"
        conn_limit: 50
        
      # High-performance database with C locale
      - db: "high_perf_db"
        owner: "perf_user"
        encoding: "UTF8"
        lc_collate: "C"
        lc_ctype: "C"
        conn_limit: 500
        
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.postgresql_users
    - vitabaks.autobase.postgresql_databases
```

### Multi-Environment Setup

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    postgresql_users:
      - {name: "app_user", password: "secure_password123", flags: "CREATEDB,NOSUPERUSER"}
      - {name: "readonly_user", password: "readonly_pass456", flags: "NOSUPERUSER"}
      - {name: "backup_user", password: "backup_pass789", flags: "REPLICATION"}
      
    postgresql_databases:
      # Application databases
      - {db: "app_production", owner: "app_user", encoding: "UTF8", lc_collate: "en_US.UTF-8", lc_ctype: "en_US.UTF-8", conn_limit: 100}
      - {db: "app_staging", owner: "app_user", encoding: "UTF8", lc_collate: "en_US.UTF-8", lc_ctype: "en_US.UTF-8", conn_limit: 50}
      - {db: "app_development", owner: "app_user", encoding: "UTF8", lc_collate: "en_US.UTF-8", lc_ctype: "en_US.UTF-8", conn_limit: 25}
      
      # Specialized databases
      - {db: "logging", owner: "app_user", encoding: "UTF8", lc_collate: "C", lc_ctype: "C"}
      - {db: "metrics", owner: "app_user", encoding: "UTF8", lc_collate: "en_US.UTF-8", lc_ctype: "en_US.UTF-8"}
      
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.postgresql_users
    - vitabaks.autobase.postgresql_databases
```

## Database Configuration Options

### Encoding Options

Common encoding values:
- **UTF8**: Unicode encoding (recommended for most applications)
- **LATIN1**: ISO 8859-1 encoding
- **WIN1252**: Windows-1252 encoding
- **SQL_ASCII**: ASCII encoding

### Locale Options

Common locale configurations:

#### Production (Language-specific)
```yaml
lc_collate: "en_US.UTF-8"
lc_ctype: "en_US.UTF-8"
```

#### High Performance (C locale)
```yaml
lc_collate: "C"
lc_ctype: "C"
```

#### International
```yaml
lc_collate: "en_US.UTF-8"
lc_ctype: "en_US.UTF-8"
```

### Template Options

- **template0**: Clean template without any site-local additions
- **template1**: Default template that may include site-local additions
- **custom_template**: Any existing database to use as a template

## Best Practices

### Database Naming
- Use lowercase names with underscores
- Avoid reserved keywords
- Keep names descriptive but concise

### Locale Selection
- Use C locale for high-performance scenarios with primarily ASCII data
- Use UTF-8 locales for international applications
- Be consistent across databases in the same application

### Connection Limits
- Set appropriate limits based on application requirements
- Consider connection pooling (PgBouncer) for applications with many connections
- Monitor actual connection usage

## Behavior Notes

- Databases are created only on the primary cluster (not on standby clusters)
- Database creation errors are ignored to handle existing databases gracefully  
- Skip execution during Ansible check mode
- Requires database owners to exist before database creation

## Error Handling

- Uses `ignore_errors: true` to handle already-existing databases gracefully
- Skips execution on standby clusters automatically
- Skips execution during check mode to prevent validation issues

## Tags

Use these tags to run specific parts of the role:

- `postgresql_databases`: Create/configure PostgreSQL databases

### Example with Tags

```bash
# Create databases only
ansible-playbook playbook.yml --tags postgresql_databases
```

## Integration with Other Roles

This role is typically used in conjunction with:

1. **postgresql_users**: Create database owner users before creating databases
2. **postgresql_extensions**: Install extensions after databases are created
3. **postgresql_privs**: Grant additional privileges after database creation
4. **patroni**: Manage the PostgreSQL cluster

### Recommended Order

```yaml
roles:
  - vitabaks.autobase.common
  - vitabaks.autobase.patroni
  - vitabaks.autobase.postgresql_users      # 1. Create users first
  - vitabaks.autobase.postgresql_databases  # 2. Create databases
  - vitabaks.autobase.postgresql_extensions # 3. Install extensions
  - vitabaks.autobase.postgresql_privs      # 4. Grant privileges
```

## License

BSD

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
