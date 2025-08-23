# Ansible Role: wal_g

This role installs and configures [WAL-G](https://github.com/wal-g/wal-g), an archival and restoration tool for PostgreSQL. WAL-G is designed to perform continuous archiving of PostgreSQL WAL files and provide point-in-time recovery capabilities with cloud storage support.

## Description

WAL-G is a fast and efficient tool for backing up and restoring PostgreSQL databases. It provides continuous archiving of WAL (Write-Ahead Log) files and supports various storage backends including cloud storage. This role:

- Installs WAL-G from precompiled binaries or source code
- Configures WAL-G for continuous WAL archiving
- Sets up cloud storage backends (AWS S3, Google Cloud, Azure, etc.)
- Integrates with Patroni for automated backup management
- Provides automatic configuration based on cloud provider
- Manages WAL-G configuration files and permissions

## Requirements

### Prerequisites

- PostgreSQL server must be installed
- Cloud storage credentials (if using cloud backends)
- Network connectivity for cloud storage access
- For source installation: Go 1.19+ and development tools

### Operating System Support

- **Debian**: 11, 12, 13
- **Ubuntu**: 22.04, 24.04
- **CentOS Stream**: 9, 10
- **Oracle Linux**: 8, 9, 10
- **Rocky Linux**: 8, 9, 10
- **AlmaLinux**: 8, 9, 10

- **Debian/Ubuntu**: 18.04, 20.04, 22.04, 24.04
- **RHEL/CentOS/Rocky/AlmaLinux**: 8, 9 (RHEL 8 excluded for binary installation due to GLIBC requirements)
- **Amazon Linux**: 2023

## Role Variables

This role uses variables defined in the `vitabaks.autobase.common` role and provides automatic configuration based on cloud providers.

### Installation Configuration

```yaml
# WAL-G installation method
wal_g_installation_method: "binary"    # or "src" for source compilation

# WAL-G version to install
wal_g_version: "2.0.1"

# WAL-G binary path
wal_g_path: "/usr/local/bin/wal-g"

# Installation source URL (for binary installation)
wal_g_download_url: "https://github.com/wal-g/wal-g/releases/download/v{{ wal_g_version }}/wal-g-pg-ubuntu-20.04-amd64"
```

### Automatic Configuration

```yaml
# Enable automatic backup configuration based on cloud provider
wal_g_auto_conf: true

# Cloud provider (auto-configures storage backend)
cloud_provider: ""  # aws, gcp, azure, digitalocean
```

### Storage Configuration

#### AWS S3 Configuration
```yaml
wal_g_s3_bucket: "my-postgres-backups"
wal_g_s3_region: "us-east-1"
wal_g_s3_endpoint: "https://s3.amazonaws.com"
wal_g_s3_access_key_id: "{{ vault_aws_access_key }}"
wal_g_s3_secret_access_key: "{{ vault_aws_secret_key }}"
```

#### Google Cloud Storage Configuration
```yaml
wal_g_gs_bucket: "my-postgres-backups"
wal_g_google_application_credentials: "/path/to/service-account.json"
```

#### Azure Configuration
```yaml
wal_g_azure_storage_account: "mystorageaccount"
wal_g_azure_storage_access_key: "{{ vault_azure_access_key }}"
wal_g_azure_storage_container: "postgres-backups"
```

#### File System Configuration
```yaml
wal_g_file_prefix: "/backup/wal-g"
```

### Backup and Retention Settings

```yaml
# Compression settings
wal_g_compression_method: "brotli"     # brotli, gzip, lz4, lzma, zstd
wal_g_compression_level: 6             # 1-9 for gzip, 1-11 for brotli

# Retention policy
wal_g_retain_count: 7                  # Number of backups to retain
wal_g_retain_after: "168h"             # Retain for 168 hours (7 days)

# Upload settings
wal_g_upload_concurrency: 16           # Parallel upload workers
wal_g_download_concurrency: 10         # Parallel download workers

# Delta backups
wal_g_delta_max_steps: 0              # Disable delta backups (0), or max delta chain length
```

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
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
