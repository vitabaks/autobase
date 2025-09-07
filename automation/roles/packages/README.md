# Ansible Role: packages

This role manages system package installation for PostgreSQL and related components. It handles package repositories, system dependencies, and PostgreSQL installation across different operating systems and installation methods.

## Description

The packages role is responsible for installing and managing system packages required for a PostgreSQL cluster deployment. This role:

- Installs system packages required by PostgreSQL and related tools
- Manages PostgreSQL package repositories (PGDG)
- Handles PostgreSQL installation from packages or source
- Configures package manager caches and repositories
- Manages PostgreSQL AppStream modules on RHEL/CentOS
- Supports proxy environments for package downloads
- Provides flexibility for different installation methods

## Requirements

### Prerequisites

- Network connectivity for package downloads
- Appropriate privileges for package installation
- Valid package repository access

## Role Variables

This role uses variables defined in the `vitabaks.autobase.common` role.

### Installation Method

```yaml
# Installation method selection
installation_method: "packages"        # or "source"

# Skip DNF cache refresh (for faster runs)
skip_dnf_makecache: false
```

### System Packages

```yaml
# System packages to install (defined in common role)
system_packages:
  - curl
  - wget
  - gnupg2
  - lsb-release
  - ca-certificates
  - python3
  - python3-pip
  - rsync
  - htop
  - iotop
  - sysstat
  - unzip
  - tar
```

### PostgreSQL Configuration

```yaml
# PostgreSQL installation
install_postgresql_repo: true          # Install PGDG repository
postgresql_version: "16"                # PostgreSQL version to install

# PostgreSQL packages (defined in common role)
postgresql_packages:
  - "postgresql-{{ postgresql_version }}"
  - "postgresql-client-{{ postgresql_version }}"
  - "postgresql-contrib-{{ postgresql_version }}"
  - "postgresql-server-dev-{{ postgresql_version }}"

# Additional packages for specific features
postgresql_extensions_packages: []     # Extension packages
postgresql_develop_packages: []        # Development packages
```

### Repository Configuration

```yaml
# Proxy environment (if needed)
proxy_env:
  http_proxy: "http://proxy.example.com:3128"
  https_proxy: "http://proxy.example.com:3128"
  
# Repository URLs and keys
postgresql_apt_key_url: "https://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc"
postgresql_apt_repository: "deb https://apt.postgresql.org/pub/repos/apt/ {{ ansible_distribution_release }}-pgdg main"
```

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```


## Tags

Use these tags to run specific parts of the role:

- `install_packages`: Install system packages
- `install_postgres`: Install PostgreSQL packages
- `install_extensions`: Install PostgreSQL extensions
- `install_packages_from_file`: Install packages from file
- `perf`: Install performance monitoring tools
- `pgvector`: Install pgvector extension
- `postgis`: Install PostGIS extension
- `timescaledb`: Install TimescaleDB extension
- `pg_cron`: Install pg_cron extension
- `pgaudit`: Install pgAudit extension

## License

MIT

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
