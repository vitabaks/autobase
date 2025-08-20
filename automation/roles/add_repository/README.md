# Ansible Role: add_repository

This role manages repository configuration for PostgreSQL and other packages on both Debian/Ubuntu and RedHat/CentOS systems. It handles the installation and configuration of various repositories including PostgreSQL PGDG repository, EPEL repository, and extension repositories like TimescaleDB and Citus.

## Description

The `add_repository` role is responsible for:

- Adding custom repositories on Debian/Ubuntu systems using `deb822_repository`
- Adding custom repositories on RedHat/CentOS systems using `yum_repository`
- Installing and configuring PostgreSQL PGDG repository
- Enabling PostgreSQL extras repository for additional packages
- Installing EPEL repository for extra packages
- Enabling PowerTools and CodeReady Builder repositories
- Setting up extension repositories (TimescaleDB, Citus)
- Managing debuginfo repositories for debugging purposes

## Variables

### Repository Control Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `install_postgresql_repo` | `true` | Install PostgreSQL PGDG repository from pgdg-redhat-repo-latest.noarch.rpm |
| `install_postgresql_repo_extras` | `true` | Enable PostgreSQL extras repository (e.g., pgdg-rhel8-extras) for additional packages like HAProxy |
| `install_epel_repo` | `true` | Install EPEL repository from epel-release-latest.noarch.rpm |

### Repository Configuration Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `apt_repository` | `[]` | List of APT repositories for Debian/Ubuntu systems |
| `yum_repository` | `[]` | List of YUM repositories for RedHat/CentOS systems |
| `proxy_env` | `{}` | Proxy environment variables |

### Extension Control Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `enable_timescale` | `false` | Enable TimescaleDB repository |
| `enable_timescaledb` | `false` | Enable TimescaleDB repository (alternative name) |
| `enable_citus` | `false` | Enable Citus repository |

## Repository Definitions

### APT Repository Format (Debian/Ubuntu)

```yaml
apt_repository:
  - name: "repository-name"              # Optional, auto-generated from URI if not specified
    types: ["deb"]                       # Repository types (default: ["deb"])
    uris: "https://example.com/repo"     # Repository URI
    signed_by: "https://example.com/key" # GPG key URL or path
    suites: "focal"                      # Distribution suite
    components: ["main"]                 # Repository components
    enabled: true                        # Whether repository is enabled (default: true)
```

### YUM Repository Format (RedHat/CentOS)

```yaml
yum_repository:
  - name: "repository-name"
    description: "Repository Description"
    baseurl: "https://example.com/repo"
    gpgkey: "https://example.com/key"    # Optional
    gpgcheck: true                       # Optional (default: true)
    enabled: true                        # Optional (default: true)
```

## Usage Examples

### Basic PostgreSQL Repository Setup

```yaml
install_postgresql_repo: true
install_postgresql_repo_extras: true  # Enables pgdg-rhel<version>-extras for HAProxy, etc.
install_epel_repo: true
```

### Custom Repository Configuration

```yaml
# For Debian/Ubuntu
apt_repository:
  - name: "custom-repo"
    uris: "https://apt.example.com"
    signed_by: "https://apt.example.com/gpg"
    suites: "{{ ansible_distribution_release }}"
    components: ["main"]

# For RedHat/CentOS
yum_repository:
  - name: "custom-repo"
    description: "Custom Repository"
    baseurl: "https://yum.example.com/repo"
    gpgkey: "https://yum.example.com/gpg"
```

### Extension Repositories

```yaml
# Enable TimescaleDB repository
enable_timescale: true

# Enable Citus repository (PostgreSQL 11+ only)
enable_citus: true
postgresql_version: 15
```

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations

## Platform Support

### Supported Operating Systems

- **Debian/Ubuntu**: Uses `deb822_repository` for modern repository management
- **RedHat/CentOS/AlmaLinux/Oracle Linux**: Uses `yum_repository` and `dnf config-manager`

### Supported Architectures

- **x86_64/amd64**: Full support for all repositories
- **arm64**: Limited support (TimescaleDB and Citus have x86_64-only repositories)

## Special Features

### Automatic PowerTools/CodeReady Builder Enablement

The role automatically enables additional repositories based on the distribution:

- **AlmaLinux/Rocky 8**: PowerTools repository
- **RHEL 9+/AlmaLinux/Rocky**: CodeReady Linux Builder (crb) repository
- **Oracle Linux 8+**: CodeReady Builder repository

### PostgreSQL Debuginfo Repository

When PostgreSQL debuginfo packages are requested, the role:
1. Enables existing debuginfo repositories in pgdg-redhat-all.repo
2. Creates new debuginfo repository entries if they don't exist
3. Disables GPG checking for debuginfo packages

## Tags

Available tags for selective execution:
- `add_repo`: General repository addition
- `install_postgresql_repo`: PostgreSQL repository installation
- `install_epel_repo`: EPEL repository installation
- `timescaledb`, `timescale`: TimescaleDB repository
- `citus`: Citus repository
- `debuginfo`: PostgreSQL debuginfo repository
