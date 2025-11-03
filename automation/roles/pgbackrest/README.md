# Ansible Role: pgbackrest

Installs and configures [pgBackRest](https://github.com/pgbackrest/pgbackrest) for PostgreSQL backups and restores. Supports local and cloud repositories, optional dedicated repo host, Patroni bootstrap from backup, and cron-based scheduling.

## Role Variables

| Variable | Default | Description |
|---|---|---|
| `pgbackrest_install` | `false` | Enable installation and configuration of pgBackRest. |
| `pgbackrest_install_from_pgdg_repo` | `true` | Install packages from PGDG repositories. |
| `pgbackrest_stanza` | `"{{ patroni_cluster_name }}"` | Stanza name used by pgBackRest. |
| `pgbackrest_repo_type` | `"posix"` | Repository type: posix, s3, gcs, azure. |
| `pgbackrest_repo_host` | `""` | Dedicated repository host (optional). |
| `pgbackrest_repo_user` | `"postgres"` | SSH user on repo_host (when repo_host is set). |
| `pgbackrest_conf_file` | `"/etc/pgbackrest/pgbackrest.conf"` | Path to pgBackRest config file on DB hosts. |
| `pgbackrest_conf.global` | [...] | List of global options (section [global]); see defaults. |
| `pgbackrest_conf.stanza` | [...] | List of stanza options (section [stanza]); see defaults. |
| `pgbackrest_server_conf.global` | [...] | Global options for a dedicated repo server (generated when repo_host is set). |
| `pgbackrest_archive_command` | `"pgbackrest --stanza={{ pgbackrest_stanza }} archive-push %p"` | WAL archive_command helper string. |
| `pgbackrest_patroni_cluster_restore_command` | `"/usr/bin/pgbackrest --stanza={{ pgbackrest_stanza }} --delta restore"` | Command used for cluster restore/bootstrap. |
| `pgbackrest_cron_jobs` | [...] | Cron jobs for backups (full/diff). Created on DB host by default, or on repo_host if defined. |

Note: To bootstrap via backup set `patroni_cluster_bootstrap_method: "pgbackrest"`.

### pgBackRest Configuration Structure

The `pgbackrest_conf` variable uses a dictionary with global and stanza sections:
- `global`: repository and general settings
- `stanza`: database-specific settings (`pg1-path`, `pg1-socket-path`, etc.)


### pgBackRest auto conf (cloud_provider)

If `cloud_provider` is set, the role runs tasks/[auto_conf.yml](./tasks/auto_conf.yml) to automatically build `pgbackrest_conf` for the selected backend.

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
