# Ansible Role: pgbackrest

This role installs and configures [pgBackRest](https://pgbackrest.org/), a reliable backup and restore solution designed specifically for PostgreSQL with support for full, incremental, and differential backups, encryption, compression, and cloud storage.

## Requirements

### Prerequisites

- PostgreSQL server must be installed
- Sufficient storage space for backups
- Network connectivity for remote repositories
- Cloud credentials for cloud storage (if used)

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `pgbackrest_auto_conf` | `true` | Enable automatic backup configuration based on cloud provider |
| `cloud_provider` | `""` | Cloud provider for auto-configuration (`aws`, `gcp`, `azure`, `digitalocean`) |
| `pgbackrest_install_from_pgdg_repo` | `true` | Install from PostgreSQL Development Group repositories |
| `pgbackrest_repo_name` | `"apt-postgresql-org"` | Repository name for package installation |
| `postgresql_version` | `"16"` | PostgreSQL version for compatibility |
| `pgbackrest_conf` | Complex structure | pgBackRest configuration options (see below) |

### pgBackRest Configuration Structure

The `pgbackrest_conf` variable uses a dictionary structure with `global` and `stanza` sections:

| Section | Purpose | Example Options |
|---------|---------|-----------------|
| `global` | Global pgBackRest settings | `log-level-console`, `repo1-type`, `retention-full` |
| `stanza` | Database-specific settings | `pg1-path`, `pg1-port` |

### Common Global Options

| Option | Default | Description |
|--------|---------|-------------|
| `log-level-console` | `"info"` | Console log level |
| `log-level-file` | `"debug"` | File log level |
| `log-path` | `"/var/log/pgbackrest"` | Log file directory |
| `repo1-type` | `"posix"` | Repository type (`posix`, `s3`, `gcs`, `azure`) |
| `repo1-path` | `"/var/lib/pgbackrest"` | Local repository path |
| `repo1-retention-full` | `"7"` | Number of full backups to retain |
| `start-fast` | `"y"` | Force immediate checkpoint for backups |

### Cloud Storage Options

| Option | Description | Example |
|--------|-------------|---------|
| `repo1-s3-bucket` | AWS S3 bucket name | `"my-backup-bucket"` |
| `repo1-s3-region` | AWS S3 region | `"us-east-1"` |
| `repo1-gcs-bucket` | Google Cloud Storage bucket | `"my-gcs-bucket"` |
| `repo1-azure-container` | Azure container name | `"my-azure-container"` |
| `repo1-cipher-type` | Encryption type | `"aes-256-cbc"` |

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Tags

Use these tags to run specific parts of the role:

- `pgbackrest`: Run all pgBackRest tasks
- `pgbackrest_install`: Install pgBackRest only
- `pgbackrest_conf`: Configure pgBackRest only
- `pgbackrest_repo`: Set up repositories only
- `pgbackrest_ssh_keys`: Configure SSH keys only
- `pgbackrest_stanza_create`: Create stanza only
- `pgbackrest_cron`: Configure backup cron jobs only
- `pgbackrest_bootstrap_script`: Set up bootstrap scripts only

## License

MIT

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
