# Ansible Role: pgbackrest

This role installs and configures [pgBackRest](https://pgbackrest.org/), a reliable backup and restore solution designed specifically for PostgreSQL. pgBackRest provides full, incremental, and differential backups with encryption, compression, and cloud storage support.

## Description

pgBackRest is a backup and restore tool specifically designed for PostgreSQL that aims to be simple, reliable, and robust. This role:

- Installs pgBackRest from PostgreSQL Development Group (PGDG) repositories
- Configures backup repositories (local, remote, or cloud storage)
- Sets up full, incremental, and differential backup schedules
- Configures backup retention policies
- Provides cloud storage integration (AWS S3, Google Cloud, Azure)
- Manages backup encryption and compression
- Integrates with Patroni-managed PostgreSQL clusters

## Requirements

### Prerequisites

- PostgreSQL server must be installed
- Sufficient storage space for backups
- Network connectivity for remote repositories
- Cloud credentials for cloud storage (if used)

### Operating System Support

- **Debian/Ubuntu**: 18.04, 20.04, 22.04, 24.04
- **RHEL/CentOS/Rocky/AlmaLinux**: 8, 9
- **Amazon Linux**: 2023

## Role Variables

This role uses variables defined in the `vitabaks.autobase.common` role and provides automatic configuration based on cloud providers.

### Automatic Configuration

```yaml
# Enable automatic backup configuration based on cloud provider
pgbackrest_auto_conf: true

# Cloud provider (auto-configures cloud storage)
cloud_provider: ""  # aws, gcp, azure, digitalocean
```

### Installation Configuration

```yaml
# Repository configuration
pgbackrest_install_from_pgdg_repo: true
pgbackrest_repo_name: "apt-postgresql-org"

# PostgreSQL version for compatibility
postgresql_version: "16"
```

### Backup Configuration

```yaml
# pgBackRest configuration structure
pgbackrest_conf:
  global:
    - {option: "log-level-console", value: "info"}
    - {option: "log-level-file", value: "debug"}
    - {option: "log-path", value: "/var/log/pgbackrest"}
    - {option: "repo1-type", value: "posix"}
    - {option: "repo1-path", value: "/var/lib/pgbackrest"}
    - {option: "repo1-retention-full", value: "7"}
    - {option: "start-fast", value: "y"}
    
  stanza:
    - {option: "pg1-path", value: "{{ postgresql_data_dir }}"}
    - {option: "pg1-port", value: "{{ postgresql_port }}"}
```

### Cloud Storage Configuration

#### AWS S3 Configuration
```yaml
pgbackrest_conf:
  global:
    - {option: "repo1-type", value: "s3"}
    - {option: "repo1-s3-bucket", value: "my-backup-bucket"}
    - {option: "repo1-s3-region", value: "us-east-1"}
    - {option: "repo1-s3-endpoint", value: "s3.amazonaws.com"}
    - {option: "repo1-cipher-type", value: "aes-256-cbc"}
```

#### Google Cloud Storage Configuration
```yaml
pgbackrest_conf:
  global:
    - {option: "repo1-type", value: "gcs"}
    - {option: "repo1-gcs-bucket", value: "my-backup-bucket"}
    - {option: "repo1-gcs-key-type", value: "service"}
    - {option: "repo1-gcs-key", value: "/path/to/service-account.json"}
```

#### Azure Configuration
```yaml
pgbackrest_conf:
  global:
    - {option: "repo1-type", value: "azure"}
    - {option: "repo1-azure-container", value: "my-backup-container"}
    - {option: "repo1-azure-account", value: "mystorageaccount"}
```

### Retention and Scheduling

```yaml
# Backup retention policies
pgbackrest_conf:
  global:
    - {option: "repo1-retention-full", value: "7"}        # Keep 7 full backups
    - {option: "repo1-retention-diff", value: "3"}        # Keep 3 differential backups  
    - {option: "repo1-retention-archive", value: "7"}     # Keep 7 days of WAL archives
```

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Example Playbook

### Basic Local Backup Configuration

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    pgbackrest_conf:
      global:
        - {option: "log-level-console", value: "info"}
        - {option: "log-path", value: "/var/log/pgbackrest"}
        - {option: "repo1-type", value: "posix"}
        - {option: "repo1-path", value: "/backup/pgbackrest"}
        - {option: "repo1-retention-full", value: "7"}
        - {option: "start-fast", value: "y"}
        
  roles:
    - vitabaks.autobase.pgbackrest
```

### AWS S3 Cloud Backup Configuration

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    cloud_provider: "aws"
    pgbackrest_auto_conf: true
    
    # Manual S3 configuration (alternative to auto_conf)
    pgbackrest_conf:
      global:
        - {option: "log-level-console", value: "info"}
        - {option: "log-path", value: "/var/log/pgbackrest"}
        
        # S3 repository configuration
        - {option: "repo1-type", value: "s3"}
        - {option: "repo1-s3-bucket", value: "company-pg-backups"}
        - {option: "repo1-s3-region", value: "us-west-2"}
        - {option: "repo1-s3-endpoint", value: "s3.us-west-2.amazonaws.com"}
        
        # Encryption and compression
        - {option: "repo1-cipher-type", value: "aes-256-cbc"}
        - {option: "repo1-cipher-pass", value: "{{ vault_backup_encryption_key }}"}
        - {option: "compress-type", value: "lz4"}
        
        # Retention policies
        - {option: "repo1-retention-full", value: "14"}
        - {option: "repo1-retention-diff", value: "7"}
        - {option: "repo1-retention-archive", value: "14"}
        
        # Performance tuning
        - {option: "process-max", value: "4"}
        - {option: "start-fast", value: "y"}
        
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.pgbackrest
```

### High-Performance Multi-Repository Configuration

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    pgbackrest_conf:
      global:
        # Logging
        - {option: "log-level-console", value: "warn"}
        - {option: "log-level-file", value: "info"}
        - {option: "log-path", value: "/var/log/pgbackrest"}
        
        # Primary repository (local)
        - {option: "repo1-type", value: "posix"}
        - {option: "repo1-path", value: "/fast-storage/pgbackrest"}
        - {option: "repo1-retention-full", value: "3"}
        - {option: "repo1-retention-diff", value: "2"}
        
        # Secondary repository (S3)
        - {option: "repo2-type", value: "s3"}
        - {option: "repo2-s3-bucket", value: "disaster-recovery-backups"}
        - {option: "repo2-s3-region", value: "us-east-1"}
        - {option: "repo2-retention-full", value: "30"}
        - {option: "repo2-cipher-type", value: "aes-256-cbc"}
        
        # Performance settings
        - {option: "process-max", value: "8"}
        - {option: "compress-type", value: "lz4"}
        - {option: "compress-level", value: "6"}
        - {option: "start-fast", value: "y"}
        
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.pgbackrest
```

### Development Environment

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    pgbackrest_conf:
      global:
        - {option: "log-level-console", value: "debug"}
        - {option: "log-path", value: "/var/log/pgbackrest"}
        - {option: "repo1-type", value: "posix"}
        - {option: "repo1-path", value: "/tmp/pgbackrest"}
        - {option: "repo1-retention-full", value: "2"}
        - {option: "start-fast", value: "y"}
        
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.pgbackrest
```

## Backup Types

### Full Backup
Complete backup of all database files:
```bash
pgbackrest backup --stanza=main --type=full
```

### Incremental Backup  
Backs up only changes since the last backup:
```bash
pgbackrest backup --stanza=main --type=incr
```

### Differential Backup
Backs up all changes since the last full backup:
```bash
pgbackrest backup --stanza=main --type=diff
```

## Configuration Templates

This role provides the following templates:

- **pgbackrest.conf.j2**: Main pgBackRest configuration file
- **pgbackrest.server.conf.j2**: Server-specific configuration
- **pgbackrest.server.stanza.conf.j2**: Stanza configuration for servers
- **pgbackrest_bootstrap.sh.j2**: Bootstrap script for initial setup

## Cloud Provider Auto-Configuration

When `cloud_provider` is set, the role automatically configures cloud storage:

### AWS Configuration
- Sets up S3 repository type
- Configures IAM roles/credentials
- Sets appropriate S3 endpoints

### Google Cloud Configuration  
- Configures Google Cloud Storage
- Sets up service account authentication
- Configures appropriate GCS settings

### Azure Configuration
- Sets up Azure Blob Storage
- Configures Azure authentication
- Sets container and account settings

### DigitalOcean Spaces Configuration
- Configures Spaces object storage
- Sets up appropriate endpoints
- Configures access credentials

## Security Features

### Encryption
```yaml
pgbackrest_conf:
  global:
    - {option: "repo1-cipher-type", value: "aes-256-cbc"}
    - {option: "repo1-cipher-pass", value: "{{ vault_encryption_passphrase }}"}
```

### Access Control
- Backup files owned by postgres user
- Restricted directory permissions (750)
- Secure configuration file permissions

## Performance Optimization

### Parallel Processing
```yaml
pgbackrest_conf:
  global:
    - {option: "process-max", value: "4"}      # CPU cores for parallel backup
    - {option: "compress-level", value: "6"}   # Compression level (1-9)
    - {option: "compress-type", value: "lz4"}  # Fast compression algorithm
```

### Network Optimization
```yaml
pgbackrest_conf:
  global:
    - {option: "protocol-timeout", value: "60"}
    - {option: "db-timeout", value: "1800"}
    - {option: "archive-timeout", value: "60"}
```

## Monitoring and Maintenance

### Backup Status Check
```bash
# Check backup status
pgbackrest info --stanza=main

# List all backups
pgbackrest info --stanza=main --output=json

# Check specific backup
pgbackrest info --stanza=main --set=20231215-083000F
```

### Log Files
- Console output: Controlled by `log-level-console`
- File logging: `/var/log/pgbackrest/pgbackrest.log`
- Detailed debugging available with `debug` log level

## Common Operations

### Initial Setup
```bash
# Create stanza
pgbackrest stanza-create --stanza=main

# First full backup
pgbackrest backup --stanza=main --type=full

# Verify backup
pgbackrest check --stanza=main
```

### Restore Operations
```bash
# Point-in-time recovery
pgbackrest restore --stanza=main --target-time="2023-12-15 08:30:00"

# Restore specific backup
pgbackrest restore --stanza=main --set=20231215-083000F

# Restore to different location
pgbackrest restore --stanza=main --pg1-path=/var/lib/postgresql/restore
```

### Archive Management
```bash
# Check archive status
pgbackrest info --stanza=main --output=json | jq '.[] | .archive'

# Manual archive push
pgbackrest archive-push /path/to/wal/file

# Archive expiry
pgbackrest expire --stanza=main
```

## Integration with Cron

Schedule regular backups:

```cron
# Full backup weekly (Sunday 2 AM)
0 2 * * 0 postgres pgbackrest backup --stanza=main --type=full

# Differential backup daily (2 AM, except Sunday)  
0 2 * * 1-6 postgres pgbackrest backup --stanza=main --type=diff

# Check backup integrity daily (3 AM)
0 3 * * * postgres pgbackrest check --stanza=main
```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   - Ensure postgres user owns backup directories
   - Check directory permissions (750 for repos, 755 for logs)

2. **Cloud Storage Authentication**
   - Verify cloud credentials are properly configured
   - Check network connectivity to cloud endpoints

3. **Backup Failures**
   - Review pgBackRest logs for detailed error messages
   - Verify PostgreSQL is accessible and writable

4. **Performance Issues**
   - Adjust `process-max` based on available CPU cores
   - Tune compression settings for your workload
   - Consider network bandwidth for cloud backups

## Best Practices

### Backup Strategy
- Perform regular full backups (weekly)
- Use differential backups for daily increments
- Test restore procedures regularly
- Monitor backup completion and sizes

### Security
- Encrypt backups, especially for cloud storage
- Use strong encryption passphrases stored in Ansible Vault
- Restrict access to backup files and directories
- Regularly rotate encryption keys

### Performance
- Use fast compression algorithms (lz4) for frequent backups
- Utilize parallel processing based on available resources
- Consider local staging for cloud backups
- Monitor backup windows and performance

### Retention
- Set appropriate retention policies based on business requirements
- Balance storage costs with recovery point objectives
- Consider different retention policies for different backup types
- Regularly clean up old backups

## Tags

Use these tags to run specific parts of the role:

- `pgbackrest`: Run all pgBackRest tasks
- `pgbackrest_install`: Install pgBackRest only
- `pgbackrest_conf`: Configure pgBackRest only
- `pgbackrest_repo`: Set up repositories only

### Example with Tags

```bash
# Install pgBackRest only
ansible-playbook playbook.yml --tags pgbackrest_install

# Update configuration only
ansible-playbook playbook.yml --tags pgbackrest_conf
```

## License

BSD

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
