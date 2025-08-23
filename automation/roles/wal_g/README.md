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

## Example Playbook

### Basic Local File System Setup

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    wal_g_installation_method: "binary"
    wal_g_file_prefix: "/backup/wal-g"
    wal_g_compression_method: "brotli"
    wal_g_retain_count: 14
    
  roles:
    - vitabaks.autobase.wal_g
```

### AWS S3 Cloud Backup Configuration

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    cloud_provider: "aws"
    wal_g_auto_conf: true
    
    # Manual S3 configuration (alternative to auto_conf)
    wal_g_s3_bucket: "company-postgres-wal-g"
    wal_g_s3_region: "us-west-2"
    wal_g_s3_endpoint: "https://s3.us-west-2.amazonaws.com"
    wal_g_s3_access_key_id: "{{ vault_aws_access_key }}"
    wal_g_s3_secret_access_key: "{{ vault_aws_secret_key }}"
    
    # Performance and retention
    wal_g_compression_method: "lz4"      # Fast compression for frequent uploads
    wal_g_upload_concurrency: 32
    wal_g_retain_count: 30
    wal_g_retain_after: "720h"           # 30 days
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.wal_g
```

### Google Cloud Storage Configuration

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    cloud_provider: "gcp"
    
    # Google Cloud configuration
    wal_g_gs_bucket: "postgres-backups-gcs"
    wal_g_google_application_credentials: "/etc/postgresql/gcs-service-account.json"
    
    # Optimization for GCS
    wal_g_compression_method: "zstd"
    wal_g_compression_level: 3
    wal_g_upload_concurrency: 20
    
    # Retention policy
    wal_g_retain_count: 21
    wal_g_delta_max_steps: 5            # Enable delta backups
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.wal_g
```

### High-Performance Production Setup

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    # Source installation for latest features
    wal_g_installation_method: "src"
    
    # S3 configuration with performance tuning
    wal_g_s3_bucket: "prod-postgres-wal-g"
    wal_g_s3_region: "us-east-1"
    
    # Performance optimization
    wal_g_compression_method: "lz4"      # Fastest compression
    wal_g_upload_concurrency: 64
    wal_g_download_concurrency: 32
    
    # Advanced backup strategy
    wal_g_retain_count: 60               # Keep 60 backups
    wal_g_retain_after: "1440h"          # 60 days
    wal_g_delta_max_steps: 10            # Enable delta backup chains
    
    # Security
    wal_g_encryption_key_id: "{{ vault_kms_key_id }}"
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.wal_g
```

### Development Environment

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    wal_g_installation_method: "binary"
    wal_g_file_prefix: "/tmp/wal-g-dev"
    wal_g_compression_method: "gzip"
    wal_g_retain_count: 3                # Keep minimal backups
    wal_g_upload_concurrency: 4          # Lower resource usage
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.wal_g
```

## Installation Methods

### Binary Installation (Default)
- Downloads precompiled binaries from GitHub releases
- Faster installation process
- Limited to supported platforms
- GLIBC 2.29+ required (excludes RHEL 8)

### Source Installation
- Compiles from source code
- Requires Go 1.19+ and development tools
- Latest features and bug fixes
- Supports all platforms with proper toolchain

## Storage Backends

### AWS S3
```yaml
wal_g_s3_bucket: "bucket-name"
wal_g_s3_region: "region"
wal_g_s3_endpoint: "endpoint-url"  # Optional, defaults to AWS endpoints
```

### Google Cloud Storage
```yaml
wal_g_gs_bucket: "bucket-name"
wal_g_google_application_credentials: "/path/to/credentials.json"
```

### Azure Blob Storage
```yaml
wal_g_azure_storage_account: "account-name"
wal_g_azure_storage_access_key: "access-key"
wal_g_azure_storage_container: "container-name"
```

### File System
```yaml
wal_g_file_prefix: "/path/to/backup/directory"
```

### Swift (OpenStack)
```yaml
wal_g_swift_auth_url: "auth-url"
wal_g_swift_username: "username"
wal_g_swift_password: "password"
wal_g_swift_tenant_name: "tenant"
wal_g_swift_container: "container-name"
```

## Configuration Templates

This role provides the following templates:

- **walg.json.j2**: WAL-G configuration file with all settings

## Compression Methods

WAL-G supports multiple compression algorithms:

### Fast Compression (for frequent backups)
```yaml
wal_g_compression_method: "lz4"
wal_g_compression_level: 1
```

### Balanced (default)
```yaml
wal_g_compression_method: "brotli"
wal_g_compression_level: 6
```

### Maximum Compression (for long-term storage)
```yaml
wal_g_compression_method: "zstd"
wal_g_compression_level: 9
```

## Backup Operations

### Full Backup
```bash
# Create full backup
wal-g backup-push {{ postgresql_data_dir }}

# Create backup with name
wal-g backup-push {{ postgresql_data_dir }} --backup-name "before-upgrade"
```

### WAL Archiving
WAL-G integrates with PostgreSQL's archive_command:
```sql
-- In postgresql.conf
archive_mode = on
archive_command = 'wal-g wal-push %p'
restore_command = 'wal-g wal-fetch %f %p'
```

### List Backups
```bash
# List all backups
wal-g backup-list

# List backups in JSON format
wal-g backup-list --json

# Show backup details
wal-g backup-list --detail
```

### Restore Operations
```bash
# Restore latest backup
wal-g backup-fetch {{ postgresql_data_dir }} LATEST

# Restore specific backup
wal-g backup-fetch {{ postgresql_data_dir }} backup_20231215_083000

# Point-in-time recovery
wal-g backup-fetch {{ postgresql_data_dir }} LATEST
# Configure recovery.conf with target time
```

## Delta Backups

WAL-G supports delta backups to reduce storage usage:

```yaml
# Enable delta backups
wal_g_delta_max_steps: 5    # Maximum length of delta chain

# Delta backup behavior:
# - First backup is always full
# - Subsequent backups are delta (incremental)
# - After max_steps deltas, creates new full backup
```

## Retention Management

### Automatic Cleanup
```bash
# Delete old backups (keeps wal_g_retain_count backups)
wal-g delete retain --count {{ wal_g_retain_count }}

# Delete backups older than specified time
wal-g delete retain --after {{ wal_g_retain_after }}

# Delete specific backup
wal-g delete target backup_20231215_083000
```

### Manual Retention
```bash
# List backups to delete
wal-g delete target --dry-run backup_20231215_083000

# Confirm deletion
wal-g delete target backup_20231215_083000 --confirm
```

## Performance Tuning

### Upload/Download Concurrency
```yaml
# High-bandwidth environments
wal_g_upload_concurrency: 64
wal_g_download_concurrency: 32

# Limited bandwidth environments
wal_g_upload_concurrency: 8
wal_g_download_concurrency: 4
```

### Compression Trade-offs
- **lz4**: Fastest compression, larger files
- **gzip**: Balanced compression and speed
- **brotli**: Good compression, moderate speed  
- **zstd**: Excellent compression, configurable speed
- **lzma**: Maximum compression, slowest

## Integration with Patroni

WAL-G integrates seamlessly with Patroni for automated backup management:

```yaml
# In Patroni configuration
postgresql:
  parameters:
    archive_mode: 'on'
    archive_command: 'wal-g wal-push %p'
  recovery_conf:
    restore_command: 'wal-g wal-fetch %f %p'
```

## Monitoring and Logging

### Log Files
WAL-G logs to syslog by default. Configure logging:
```bash
# Set log level
export WALG_LOG_LEVEL=DEBUG

# Custom log destination
export WALG_LOG_DESTINATION=/var/log/wal-g.log
```

### Backup Monitoring
```bash
# Check last backup status
wal-g backup-list --detail | head -n 1

# Monitor WAL archiving
tail -f /var/log/postgresql/postgresql-*.log | grep "wal-g"

# Verify backup integrity
wal-g backup-list --json | jq '.[] | select(.backup_name == "latest")'
```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   - Ensure postgres user can read/write backup destinations
   - Check cloud storage credentials and permissions

2. **Network Connectivity**
   - Verify connectivity to cloud storage endpoints
   - Check firewall rules for outbound connections

3. **Storage Authentication**
   - Validate cloud credentials
   - Ensure proper IAM roles/permissions for cloud storage

4. **Performance Issues**
   - Adjust concurrency settings based on available bandwidth
   - Choose appropriate compression method for your use case
   - Monitor resource usage during backups

### Debug Mode
```bash
# Enable debug logging
export WALG_LOG_LEVEL=DEBUG
wal-g backup-push {{ postgresql_data_dir }}

# Verbose output
wal-g backup-list --detail
```

## Security Considerations

### Encryption
- WAL-G supports client-side encryption for cloud storage
- Use KMS keys for enhanced security in cloud environments
- Encrypt configuration files containing credentials

### Access Control
- Use IAM roles instead of access keys when possible
- Restrict backup storage access to specific IP ranges
- Regularly rotate cloud storage credentials

### Credential Management
- Store sensitive credentials in Ansible Vault
- Use cloud-native credential management (IAM roles, service accounts)
- Avoid hardcoding credentials in configuration files

## Tags

Use these tags to run specific parts of the role:

- `wal-g`: Run all WAL-G tasks
- `wal_g`: Same as wal-g (alternative)
- `wal_g_install`: Install WAL-G only
- `wal_g_conf`: Configure WAL-G only

### Example with Tags

```bash
# Install WAL-G only
ansible-playbook playbook.yml --tags wal_g_install

# Update configuration only  
ansible-playbook playbook.yml --tags wal_g_conf
```

## Best Practices

### Backup Strategy
- Combine WAL-G with regular basebackups
- Test restore procedures regularly  
- Monitor backup completion and storage usage
- Use delta backups to reduce storage costs

### Performance
- Choose compression method based on CPU vs. storage trade-offs
- Tune concurrency based on available network bandwidth
- Consider geographic location of storage for latency

### Security
- Use encryption for all backup data
- Implement proper access controls
- Regularly audit backup access logs
- Use cloud-native authentication methods

### Retention
- Set retention policies based on business requirements
- Balance storage costs with recovery requirements
- Automate old backup cleanup
- Monitor storage usage trends

## License

MIT

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
