# Ansible Role: postgresql_index_maintenance

Installs [pg_auto_reindexer](https://github.com/vitabaks/pg_auto_reindexer) and configures cron jobs for automatic PostgreSQL index maintenance.

## Role Variables

| Variable | Default | Description |
|---|---|---|
| `postgresql_index_maintenance` | `true` | Enables the role in playbooks that use this flag. |
| `postgresql_index_maintenance_start` | `0000` | Maintenance window start time in `HHMM`. |
| `postgresql_index_maintenance_stop` | `0600` | Maintenance window stop time in `HHMM`. |
| `postgresql_index_maintenance_bloat_threshold` | `30` | Index bloat threshold in percent (`--index-bloat`). |
| `postgresql_index_maintenance_size_threshold` | `1024` | Index size threshold in MB (used as `--index-maxsize` for weekdays and `--index-minsize` for weekends jobs). |
| `postgresql_index_maintenance_jobs` | `1` | Number of parallel workers (`--jobs`). |
| `postgresql_index_maintenance_cron_jobs` | `[...]` | Cron job definitions used by the `cron` role. Default cron schedule and options follow the upstream project README examples. |

Note: For PostgreSQL 11 and below the role installs the `pg_repack` package.

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
- `vitabaks.autobase.cron` - Creates and manages cron entries
