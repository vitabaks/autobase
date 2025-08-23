# Ansible Role: patroni

This role installs and configures [Patroni](https://github.com/patroni/patroni), a high-availability solution for PostgreSQL. Patroni manages PostgreSQL configuration and provides automatic failover in a PostgreSQL cluster.

## Description

Patroni is a template for you to create your own customized, high-availability solution using Python and - for maximum accessibility - a distributed configuration store like etcd, Consul, or ZooKeeper. This role:

- Installs Patroni via pip or package manager
- Configures Patroni for PostgreSQL high availability
- Sets up systemd service for Patroni management
- Configures PostgreSQL via Patroni templates
- Manages pg_hba.conf configuration
- Handles custom WAL directory setup

## Requirements

### Operating System Support

- **Debian/Ubuntu**: 18.04, 20.04, 22.04, 24.04
- **RHEL/CentOS/Rocky/AlmaLinux**: 8, 9
- **Amazon Linux**: 2023

### Dependencies

- PostgreSQL server must be installed
- Python 3.6 or higher
- One of the following DCS (Distributed Configuration Store):
  - etcd (recommended)
  - Consul
  - ZooKeeper

## Role Variables

This role uses variables defined in the `vitabaks.autobase.common` role. Key variables include:

### Installation Variables

```yaml
# Installation method for Patroni
patroni_installation_method: "pip"  # or "packages"

# Patroni version to install (when using pip)
patroni_install_version: "latest"  # or specific version like "3.2.2"

# Custom package/requirements repositories
patroni_pip_package_repo: ""
patroni_pip_requirements_repo: ""

# Use latest requirements.txt from master branch
patroni_latest_requirements: false
```

### Cluster Configuration

```yaml
# PostgreSQL cluster name (from common role)
patroni_cluster_name: "postgres-cluster"

# Superuser credentials (from common role)
patroni_superuser_username: "postgres"
patroni_superuser_password: ""  # Auto-generated if empty

# Replication user credentials (from common role)  
patroni_replication_username: "replicator"
patroni_replication_password: ""  # Auto-generated if empty
```

### Logging Configuration

```yaml
# Patroni log destination
patroni_log_destination: "logfile"  # or "syslog"
patroni_log_dir: "/var/log/patroni"
patroni_log_level: "INFO"
patroni_log_format: "%(asctime)s %(levelname)s: %(message)s"
patroni_log_dateformat: ""
patroni_log_max_queue_size: 1000
```

### Service Configuration

```yaml
# Directory paths
postgresql_data_dir: "/var/lib/postgresql/{{ postgresql_version }}/main"
postgresql_bin_dir: "/usr/lib/postgresql/{{ postgresql_version }}/bin"
postgresql_log_dir: "/var/log/postgresql"

# Custom WAL directory (optional)
postgresql_wal_dir: ""
```

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Example Playbook

### Basic PostgreSQL HA Cluster

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    patroni_cluster_name: "my-postgres-cluster"
    patroni_superuser_password: "MySecurePassword123"
    patroni_replication_password: "MyReplicationPassword123"
  roles:
    - vitabaks.autobase.patroni
```

### Advanced Configuration with Custom WAL Directory

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    patroni_cluster_name: "production-cluster"
    patroni_installation_method: "pip"
    patroni_install_version: "3.2.2"
    patroni_log_level: "DEBUG"
    postgresql_wal_dir: "/var/lib/postgresql/wal"
    
    # Custom PostgreSQL configuration
    postgresql_parameters:
      - {option: "max_connections", value: "200"}
      - {option: "shared_buffers", value: "256MB"}
      - {option: "effective_cache_size", value: "1GB"}
      
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.patroni
```

### Multi-Environment Inventory

```ini
[postgres_cluster]
postgres-01 ansible_host=10.0.1.10
postgres-02 ansible_host=10.0.1.11  
postgres-03 ansible_host=10.0.1.12

[postgres_cluster:vars]
patroni_cluster_name=production-cluster
```

## Key Features

- **High Availability**: Automatic failover and leader election
- **Configuration Management**: Centralized PostgreSQL configuration via Patroni
- **Service Management**: Systemd integration for service lifecycle management
- **Logging**: Flexible logging configuration (file or syslog)
- **Custom WAL Directory**: Support for separate WAL storage location
- **Security**: Configurable pg_hba.conf authentication rules

## File Templates

This role provides the following templates:

- **patroni.yml.j2**: Main Patroni configuration file
- **patroni.service.j2**: Systemd service definition
- **pg_hba.conf.j2**: PostgreSQL host-based authentication configuration

## Handlers

- **reload patroni**: Reloads Patroni service configuration
- **reload postgres**: Reloads PostgreSQL configuration without restart

## Tags

Use these tags to run specific parts of the role:

- `patroni`: Run all Patroni tasks
- `patroni_install`: Install Patroni package only
- `patroni_conf`: Configure Patroni only
- `pip`: Install pip dependencies only
- `pg_hba`: Configure pg_hba.conf only

### Example with Tags

```bash
# Install Patroni only
ansible-playbook playbook.yml --tags patroni_install

# Configure Patroni only  
ansible-playbook playbook.yml --tags patroni_conf
```

## License

BSD

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
