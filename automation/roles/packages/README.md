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

### Operating System Support

- **Debian/Ubuntu**: 18.04, 20.04, 22.04, 24.04
- **RHEL/CentOS/Rocky/AlmaLinux**: 8, 9
- **Amazon Linux**: 2023

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

## Example Playbook

### Basic System Package Installation

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    installation_method: "packages"
    install_postgresql_repo: true
    postgresql_version: "16"
    
  roles:
    - vitabaks.autobase.packages
```

### Custom System Packages

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    installation_method: "packages"
    
    # Custom system packages
    system_packages:
      - curl
      - wget
      - vim
      - htop
      - iotop
      - sysstat
      - rsync
      - unzip
      - tar
      - git
      - python3
      - python3-pip
      - python3-dev
      - build-essential
      
    # PostgreSQL configuration
    install_postgresql_repo: true
    postgresql_version: "15"
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.packages
```

### Proxy Environment Setup

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    installation_method: "packages"
    
    # Proxy configuration
    proxy_env:
      http_proxy: "http://proxy.company.com:3128"
      https_proxy: "http://proxy.company.com:3128"
      no_proxy: "localhost,127.0.0.1,10.0.0.0/8"
      
    # Skip cache refresh for faster deployment
    skip_dnf_makecache: true
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.packages
```

### PostgreSQL Extension Packages

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    installation_method: "packages"
    postgresql_version: "16"
    
    # Additional PostgreSQL packages
    postgresql_extensions_packages:
      - "postgresql-{{ postgresql_version }}-contrib"
      - "postgresql-{{ postgresql_version }}-plpython3"
      - "postgresql-{{ postgresql_version }}-postgis"
      - "postgresql-{{ postgresql_version }}-postgis-scripts"
      - "postgresql-{{ postgresql_version }}-pgrouting"
      - "postgresql-{{ postgresql_version }}-repack"
      
    # Development packages
    postgresql_develop_packages:
      - "postgresql-server-dev-{{ postgresql_version }}"
      - "libpq-dev"
      
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.packages
```

### Multi-Version PostgreSQL Setup

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    installation_method: "packages"
    
    # Install multiple PostgreSQL versions
    postgresql_packages:
      - "postgresql-15"
      - "postgresql-15-contrib"
      - "postgresql-16"  
      - "postgresql-16-contrib"
      - "postgresql-client-15"
      - "postgresql-client-16"
      
    # Default version
    postgresql_version: "16"
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.packages
```

## Package Categories

### System Packages

#### Essential System Tools
```yaml
system_packages:
  - curl                    # HTTP client
  - wget                    # File downloader
  - rsync                   # File synchronization
  - unzip                   # Archive extraction
  - tar                     # Archive manipulation
```

#### Monitoring and Performance
```yaml
system_packages:
  - htop                    # Interactive process viewer
  - iotop                   # I/O monitoring
  - sysstat                 # System performance tools
  - psmisc                  # Process utilities
  - lsof                    # List open files
```

#### Development Tools
```yaml
system_packages:
  - git                     # Version control
  - build-essential         # Compilation tools (Debian)
  - gcc                     # Compiler (RHEL)
  - make                    # Build automation
  - cmake                   # Cross-platform build system
```

#### Python and Scripting
```yaml
system_packages:
  - python3                 # Python interpreter
  - python3-pip            # Package installer
  - python3-dev            # Development headers
  - python3-venv           # Virtual environments
```

### PostgreSQL Packages

#### Core PostgreSQL
```yaml
postgresql_packages:
  - "postgresql-{{ postgresql_version }}"        # PostgreSQL server
  - "postgresql-client-{{ postgresql_version }}" # Client tools
  - "postgresql-contrib-{{ postgresql_version }}" # Additional modules
```

#### Development and Libraries
```yaml
postgresql_develop_packages:
  - "postgresql-server-dev-{{ postgresql_version }}"  # Development headers
  - "libpq-dev"                                       # Client library development files
```

#### Extensions and Add-ons
```yaml
postgresql_extensions_packages:
  - "postgresql-{{ postgresql_version }}-plpython3"   # Python procedural language
  - "postgresql-{{ postgresql_version }}-postgis"     # Geographic objects
  - "postgresql-{{ postgresql_version }}-repack"      # Table reorganization
  - "postgresql-{{ postgresql_version }}-partman"     # Partition management
```

## Repository Management

### PostgreSQL Development Group (PGDG) Repository

The role automatically configures PGDG repositories for access to latest PostgreSQL versions:

#### Debian/Ubuntu
```bash
# Adds PGDG APT repository
deb https://apt.postgresql.org/pub/repos/apt/ {{ ansible_distribution_release }}-pgdg main
```

#### RHEL/CentOS
```bash
# Installs PGDG RPM repository
https://download.postgresql.org/pub/repos/yum/reporpms/EL-{{ ansible_distribution_major_version }}-x86_64/
```

### AppStream Module Management (RHEL/CentOS)

On RHEL/CentOS systems, the role manages PostgreSQL AppStream modules:

```yaml
# Disable default PostgreSQL module
postgresql_module_disable: true

# Enable specific PostgreSQL module version
postgresql_module_enable: "postgresql:{{ postgresql_version }}"
```

## Installation Methods

### Package Installation (Default)
```yaml
installation_method: "packages"
```
- Installs from system package repositories
- Faster and more reliable
- Automatic dependency resolution
- Security updates via package manager

### Source Installation
```yaml
installation_method: "source"
```
- Compiles from source code
- Latest features and customizations
- Requires development tools and dependencies
- More complex but flexible

## Performance Optimizations

### Cache Management
```yaml
# Skip DNF cache refresh for faster runs
skip_dnf_makecache: true

# Only when package installation is stable
```

### Parallel Package Installation
The role includes retry logic and error handling:
```yaml
register: package_status
until: package_status is success
delay: 5
retries: 3
```

## Environment Configuration

### Proxy Support
For environments behind corporate proxies:

```yaml
proxy_env:
  http_proxy: "http://proxy.company.com:3128"
  https_proxy: "http://proxy.company.com:3128"
  no_proxy: "localhost,127.0.0.1,.company.com"
```

### Custom Repository URLs
Override default repository URLs:

```yaml
# Custom PostgreSQL repository
postgresql_apt_repository: "deb https://mirror.company.com/postgresql/ {{ ansible_distribution_release }}-pgdg main"

# Custom APT key
postgresql_apt_key_url: "https://mirror.company.com/postgresql/ACCC4CF8.asc"
```

## Package Installation Order

The role installs packages in the following order:

1. **System packages**: Basic tools and dependencies
2. **Repository configuration**: PGDG repository setup
3. **PostgreSQL packages**: Core PostgreSQL installation
4. **Extension packages**: Additional PostgreSQL extensions
5. **Development packages**: Headers and development tools

## Error Handling

### Package Installation Failures
- Automatic retry with exponential backoff
- Detailed error reporting in logs
- Graceful handling of missing packages

### Repository Issues
- Validates repository accessibility
- Falls back to distribution packages if PGDG unavailable
- Proxy environment configuration

## Monitoring and Validation

### Package Verification
```bash
# Check installed PostgreSQL packages
dpkg -l | grep postgresql  # Debian/Ubuntu
rpm -qa | grep postgresql  # RHEL/CentOS

# Verify PostgreSQL version
psql --version
```

### Repository Status
```bash
# Check repository configuration
apt policy postgresql-16    # Debian/Ubuntu
yum info postgresql16-server # RHEL/CentOS
```

## Common Package Groups

### Minimal Installation
```yaml
system_packages:
  - curl
  - wget
  - python3
  - rsync

postgresql_packages:
  - "postgresql-{{ postgresql_version }}"
  - "postgresql-client-{{ postgresql_version }}"
```

### Standard Installation
```yaml
system_packages:
  - curl
  - wget
  - htop
  - iotop
  - sysstat
  - python3
  - python3-pip
  - rsync
  - unzip
  - tar

postgresql_packages:
  - "postgresql-{{ postgresql_version }}"
  - "postgresql-client-{{ postgresql_version }}"
  - "postgresql-contrib-{{ postgresql_version }}"
```

### Full Installation
```yaml
# Includes all standard packages plus development tools and extensions
```

## Tags

Use these tags to run specific parts of the role:

- `install_packages`: Install system packages only
- `install_postgres`: Install PostgreSQL packages only

### Example with Tags

```bash
# Install system packages only
ansible-playbook playbook.yml --tags install_packages

# Install PostgreSQL packages only
ansible-playbook playbook.yml --tags install_postgres
```

## Troubleshooting

### Common Issues

1. **Repository access failures**
   - Check network connectivity
   - Verify proxy configuration
   - Validate repository URLs

2. **Package conflicts**
   - Remove conflicting packages
   - Clear package manager cache
   - Check for held packages

3. **AppStream module issues (RHEL/CentOS)**
   - Reset AppStream modules
   - Manually disable/enable modules
   - Check for conflicting streams

### Debug Commands
```bash
# Check package manager logs
journalctl -u packagekit    # systemd systems
tail -f /var/log/apt/*      # Debian/Ubuntu
tail -f /var/log/dnf*       # RHEL/CentOS

# Verify repository configuration
apt-cache policy            # Debian/Ubuntu
yum repolist               # RHEL/CentOS
```

## Best Practices

### Repository Management
- Use official PGDG repositories for PostgreSQL
- Keep repository configurations in version control
- Test package installations in staging first

### Security
- Verify package signatures
- Use HTTPS for repository access
- Keep packages updated regularly

### Performance
- Use local mirrors when available
- Cache package downloads in CI/CD pipelines
- Minimize package installation time with selective installs

## License

BSD

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
