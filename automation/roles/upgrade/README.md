## PostgreSQL in-place major upgrade

This role is designed for in-place major upgrades of PostgreSQL (e.g., from version 15 to 16).

#### Compatibility

The upgrade is supported starting from PostgreSQL 9.3 and up to the latest PostgreSQL version.

#### Requirements

There is no need to plan additional disk space, because when upgrading PostgreSQL using hard links instead of copying files. However, it is required that the `pg_old_datadir` and `pg_new_datadir` are located within the same top-level directory (`pg_upper_datadir` variable).

Specify the current (old) version of PostgreSQL in the `pg_old_version` variable and target version of PostgreSQL for the upgrade in the `pg_new_version` variable.

#### Recommendations

1. Before upgrading to a new major version, it's recommended to update PostgreSQL and its extensions. Additionally, consider updating Patroni and the entire system.

   To achieve this, use the `update_pgcluster.yml` playbook. More details can be found [here](../update/README.md).

2. Before moving forward, execute preliminary checks to ensure that your database schema is compatible with the upcoming PostgreSQL version and that the cluster is ready for the upgrade.

   To do this, run the `pg_upgrade.yml` playbook using the tags '`pre-checks,upgrade-check`'.

   If any errors arise, such as schema object incompatibilities, resolve these issues and repeat the checks.

   Once the playbook completes the pre-checks without any errors, you should see the following messages in the Ansible log:

   - "`The database schema is compatible with PostgreSQL <new_version>`"
   - "`Clusters are compatible`"

   Upon seeing these messages, proceed to run the playbook without any tags to initiate the upgrade.

### Upgrade

```bash
ansible-playbook pg_upgrade.yml -e "pg_old_version=14 pg_new_version=15"
```

#### Database Downtime Considerations

To minimize or even eliminate errors during database upgrades (depending on the workload and timeouts), we pause the PgBouncer pools. From an application's perspective, this does not result in terminated database connections. Instead, applications might experience a temporary increase in query latency while the PgBouncer pools are paused.

On average, the PgBouncer pause duration is approximately 30 seconds. However, for larger databases, this pause might be extended due to longer `pg_upgrade` and `rsync` procedures. The default maximum wait time for a request during a pause is set to 2 minutes (controlled by the `query_wait_timeout` pgbouncer parameter). If the pause exceeds this duration, connections will be terminated with a timeout error.

### Rollback

This playbook performs a rollback of a PostgreSQL upgrade.

Note: In some scenarios, if errors occur, the pg_upgrade.yml playbook may automatically initiate a rollback. Alternatively, if the automatic rollback does not occur, you can manually execute the pg_upgrade_rollback.yml playbook to revert the changes.

```bash
ansible-playbook pg_upgrade_rollback.yml
```

It's designed to be used when a PostgreSQL upgrade hasn't been fully completed and the new version hasn't been started.
The rollback operation is performed by starting the Patroni cluster with the old version of PostgreSQL using the same PGDATA.
The playbook first checks the health of the current cluster, verifies the version of PostgreSQL, and ensures the new PostgreSQL is not running.
If these checks pass, the playbook switches back to the old PostgreSQL paths and restarts the Patroni service.

### Variables

| Variable Name                                | Description                                                                                                                                                                           | Default Value |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------: |
| `pg_old_version`                             | Current (old) version of PostgreSQL.                                                                                                                                                  |          `""` |
| `pg_new_version`                             | Target version of PostgreSQL for the upgrade.                                                                                                                                         |          `""` |
| `pg_old_bindir`                              | Directory containing binaries for the old PostgreSQL version.                                                                                                                         | Derived value |
| `pg_old_datadir`                             | Data directory path for the old PostgreSQL version.                                                                                                                                   | Derived value |
| `pg_old_confdir`                             | Configuration directory path for the old PostgreSQL version.                                                                                                                          | Derived value |
| `pg_new_bindir`                              | Directory containing binaries for the new PostgreSQL version.                                                                                                                         | Derived value |
| `pg_new_datadir`                             | Data directory path for the new PostgreSQL version.                                                                                                                                   | Derived value |
| `pg_new_confdir`                             | Configuration directory path for the new PostgreSQL version.                                                                                                                          | Derived value |
| `pg_new_wal_dir`                             | Custom WAL directory for the new PostgreSQL version.                                                                                                                                  | Derived value |
| `pg_upper_datadir`                           | Top-level directory containing both old and new PostgreSQL data directories.                                                                                                          | Derived value |
| `pg_new_packages`                            | List of package names for the new PostgreSQL version to be installed.                                                                                                                 | Derived value |
| `pg_old_packages_remove`                     | Whether to remove old PostgreSQL packages after the upgrade.                                                                                                                          |        `true` |
| `pg_start_stop_timeout`                      | Timeout when starting/stopping PostgreSQL during the upgrade (in seconds).                                                                                                            |        `1800` |
| `schema_compatibility_check`                 | Check database schema compatibility with the new PostgreSQL version before upgrading.                                                                                                 |        `true` |
| `schema_compatibility_check_port`            | Port for temporary PostgreSQL instance for schema compatibility checking.                                                                                                             | Derived value |
| `schema_compatibility_check_timeout`         | Max duration for compatibility check (pg_dumpall --schema-only) in seconds.                                                                                                           |        `3600` |
| `vacuumdb_parallel_jobs`                     | Execute the analyze command in parallel by running `njobs` commands simultaneously. This option may reduce the processing time but it also increases the load on the database server. | all CPU cores |
| `vacuumdb_analyze_timeout`                   | Max duration of analyze command in seconds.                                                                                                                                           |        `3600` |
| `vacuumdb_analyze_terminate_treshold`        | Terminate active queries that are longer than the specified time (in seconds) during the collection of statistics (0 = do not terminate active backends).                             |           `0` |
| `update_extensions`                          | Automatically update all PostgreSQL extensions.                                                                                                                                       |        `true` |
| `max_replication_lag_bytes`                  | Maximum allowed replication lag in bytes.                                                                                                                                             |    `10485760` |
| `max_transaction_sec`                        | Maximum allowed duration for a transaction in seconds.                                                                                                                                |          `15` |
| `copy_files_to_all_server`                   | Copy files located in the "files" directory to all servers. (optional)                                                                                                                |          `[]` |
| `pgbouncer_pool_pause`                       | Pause pgbouncer pools during upgrade.                                                                                                                                                 |        `true` |
| `pgbouncer_pool_pause_timeout`               | The maximum waiting time (in seconds) for the pool to be paused. For each iteration of the loop when trying to pause all pools.                                                       |           `2` |
| `pgbouncer_pool_pause_terminate_after`       | Time in seconds after which script terminates slow active queries.                                                                                                                    |          `30` |
| `pgbouncer_pool_pause_stop_after`            | Time in seconds after which the script exits with an error if unable to pause all pgbouncer pools.                                                                                    |          `60` |
| `pg_slow_active_query_treshold`              | Time in milliseconds to wait for active queries before trying to pause the pool.                                                                                                      |        `1000` |
| `pg_slow_active_query_treshold_to_terminate` | Time in milliseconds after reaching "pgbouncer_pool_pause_terminate_after" before the script terminates active queries.                                                               |         `100` |
| `pgbackrest_stanza_upgrade`                  | Perform the "stanza-upgrade" command after the upgrade (if 'pgbackrest_install' is 'true').                                                                                           |        `true` |

Note: For variables marked as "Derived value", the default value is determined based on other variables. \
Please see the variable file vars/[upgrade.yml](../../vars/upgrade.yml)

---

### Upgrade Plan:

#### 1. PRE-UPGRADE: Perform Pre-Checks

- **Make sure that the required variables are specified**
  - Notes: `pg_old_version` and `pg_new_version` variables
  - Stop, if one or more required variables have empty values.
- **Make sure that the old and new data and confg directories do not match**
  - Stop, if `pg_old_datadir` and `pg_new_datadir`, or `pg_old_confdir` and `pg_new_confdir` match.
- **Make sure the ansible required Python library is installed**
  - Notes: Install 'pexpect' package if missing
- **Test PostgreSQL database access using a unix socket**
  - if there is an error (no pg_hba.conf entry):
    - Add temporary local access rule (during the upgrade)
    - Update the PostgreSQL configuration
- **Check the current version of PostgreSQL**
  - Stop, if the current version does not match `pg_old_version`
  - Stop, if the current version greater than or equal to `pg_new_version`. No upgrade is needed.
- **Ensure new data directory is different from the current one**
  - Note: This check is necessary to avoid the risk of deleting the current data directory
  - Stop, if the current data directory is the same as `pg_new_datadir`.
  - Stop, if the current WAL directory is the same as `pg_new_wal_dir` (if a custom wal dir is used).
- **Make sure that physical replication is active**
  - Stop, if there are no active replicas
- **Make sure there is no high replication lag**
  - Stop, if replication lag is high (more than `max_replication_lag_bytes`)
- **Make sure there are no long-running transactions**
  - Stop, if long-running transactions detected (more than `max_transaction_sec`)
- **Make sure that SSH key-based authentication is configured between cluster nodes**
  - Create and copy ssh keys between database servers (if not configured)
- **Perform Rsync Checks**
  - Make sure that the rsync package are installed
  - Create 'testrsync' file on Primary
  - Test rsync and ssh key access
  - Cleanup 'testrsync' file
- **Check if PostgreSQL tablespaces exist**
  - Print tablespace location (if exists)
  - Note: If tablespaces are present they will be upgraded (step 5) on replicas using rsync
- **Make sure that the 'recovery.signal' file is absent** in the data directory
- **Test PgBouncer access via unix socket**
  - Ensure correct permissions for PgBouncer unix socket directory
  - Test access via unix socket to be able to perform 'PAUSE' command
- **Make sure that the cluster ip address (VIP) is running**
  - Notes: if 'cluster_vip' is defined

#### 2. PRE-UPGRADE: Install new PostgreSQL packages

- Clean yum/dnf cache (for RedHat based) or Update apt cache for (Debian based)
- Install new PostgreSQL packages
- Install TimescaleDB package for new PostgreSQL
  - Note: if 'enable_timescale' is 'true'

#### 3. PRE-UPGRADE: Initialize new db, schema compatibility check, and pg_upgrade --check

- **Initialize new PostgreSQL**
  - Make sure new PostgreSQL data directory exists
  - Make sure new PostgreSQL data directory is not initialized
    - If already initialized:
      - Perform pg_dropcluster (for Debian based)
      - Clear the new PostgreSQL data directory
  - Get the current install user (rolname with oid = 10)
  - Get the current encoding and data_checksums settings
  - Initialize new PostgreSQL data directory
    - for Debain based: on all database servers to create default config files
    - for RedHat based: on the Primary only
- **Copy files specified in the `copy_files_to_all_server` variable** (vars/upgrade.yml), [optional]
  - Notes: for example, it may be necessary for Postgres Full-Text Search (FTS) files
- **Schema compatibility check**
  - Get the current `shared_preload_libraries` settings
  - Get the current `cron.database_name` settings
    - Notes: if 'pg_cron' is defined in 'pg_shared_preload_libraries'
  - Start new PostgreSQL to check the schema compatibility
    - Note: on the port specified in the `schema_compatibility_check_port` variable
    - Wait for PostgreSQL to start
  - Check the compatibility of the database schema with the new PostgreSQL
    - Notes: used `pg_dumpall` with `--schema-only` options
    - Wait for the schema compatibility check to complete
  - Checking the result of the schema compatibility
    - Note: Checking for errors in `/tmp/pg_schema_compatibility_check.log`
    - Stop, if the scheme is not compatible (there are errors)
  - Print result of checking the compatibility of the scheme
  - Stop new PostgreSQL to re-initdb
  - Drop new PostgreSQL to re-initdb (perform pg_dropcluster for Debian based)
  - Reinitialize the database after checking schema compatibility
- **Perform pg_upgrade check**
  - Get the current `shared_preload_libraries` settings
  - Verify the two clusters are compatible (`pg_upgrade --check`)
  - Print the result of the pg_upgrade check

#### 4. PRE-UPGRADE: Prepare the Patroni configuration

- Backup the patroni.yml configuration file
- Edit the patroni.yml configuration file
  - **Update parameters**: `data_dir`, `bin_dir`, `config_dir`
  - **Prepare the PostgreSQL parameters**
    - Notes: Removed or renamed parameters
  - **Remove 'standby_cluster' parameter (if exists)**
    - Notes: To support upgrades in the Patroni Standby Cluster
- **Copy pg_hba.conf to `pg_new_confdir`**
  - Notes: to save pg_hba rules

#### 5. UPGRADE: Upgrade PostgreSQL

- **Enable maintenance mode for Patroni cluster** (pause)
- **Enable maintenance mode for HAProxy** (for 'Type A' scheme)
  - Notes: if 'pgbouncer_install' is 'true' and 'pgbouncer_pool_pause' is 'true'
  - Stop confd service
  - Update haproxy conf file
    - Notes: Temporarily disable http-checks in order to keep database connections after stopping the Patroni service
  - Reload haproxy service
- **Enable maintenance mode for vip-manager** (for 'Type B' scheme)
  - Notes: if 'pgbouncer_install' is 'true' and 'pgbouncer_pool_pause' is 'true'
  - Update vip-manager service file (comment out 'ExecStopPost')
    - Notes: Temporarily disable vip-manager service to keep database connections after stopping the Patroni service
  - Stop vip-manager service
    - Notes: This prevents the VIP from being removed when the Patroni leader is unavailable during maintenance
  - Make sure that the cluster ip address (VIP) is running
- **Stop Patroni service**
  - Wait until the Patroni cluster is stopped
- **Execute CHECKPOINT before stopping PostgreSQL**
  - Wait for the CHECKPOINT to complete
- **Wait until replication lag is less than `max_replication_lag_bytes`**
  - Notes: max wait time: 2 minutes
  - Stop, if replication lag is high
  - Perform rollback
    - Print error message: "There's a replication lag in the PostgreSQL Cluster. Please try again later"
- **Perform PAUSE on all pgbouncers servers**
  - Notes: if 'pgbouncer_install' is 'true' and 'pgbouncer_pool_pause' is 'true'
  - Notes: pgbouncer pause script (details in [pgbouncer_pause.yml](tasks/pgbouncer_pause.yml)) performs the following actions:
    - Waits for active queries on the database servers to complete (with a runtime more than `pg_slow_active_query_treshold`).
    - If there are no active queries, sends a `PAUSE` command to each pgbouncer servers in parallel (using `xargs` and ssh connections).
    - If all pgbouncer are successfully paused, the script exits with code 0 (successful).
    - If active queries do not complete within 30 seconds (`pgbouncer_pool_pause_terminate_after` variable), the script terminates slow active queries (longer than `pg_slow_active_query_treshold_to_terminate`).
    - If after that it is still not possible to pause the pgbouncer servers within 60 seconds (`pgbouncer_pool_pause_stop_after` variable) from the start of the script, the script exits with an error.
      - Perform rollback
        - Print error message: "PgBouncer pools could not be paused, please try again later."
- **Stop PostgreSQL** on the Leader and Replicas
  - Check if old PostgreSQL is stopped
  - Check if new PostgreSQL is stopped
- **Get 'Latest checkpoint location'** on the Leader and Replicas
  - Print 'Latest checkpoint location' for the Leader and Replicas
- **Check if all 'Latest checkpoint location' values match**
  - if 'Latest checkpoint location' values match
    - Print info message:
      - "'Latest checkpoint location' is the same on the leader and its standbys"
  - if 'Latest checkpoint location' values doesn't match
    - Perform rollback
      - Print error message: "Latest checkpoint location' doesn't match on leader and its standbys. Please try again later"
- **Upgrade the PostgreSQL on the Primary** (using pg_upgrade --link)
  - Perform rollback, if the upgrade failed
  - Print the result of the pg_upgrade
- **Make sure that the new data directory are empty on the Replica**
- **Upgrade the PostgreSQL on the Replica** (using rsync --hard-links)
  - Wait for the rsync to complete
- **Upgrade the PostgreSQL tablespaces on the Replica** (using rsync --hard-links)
  - Notes: if tablespaces exist
  - Wait for the tablespaces rsync to complete
- **Synchronize WAL directory** (if `pg_new_wal_dir` is defined) [optional]
  - Make sure new pg_wal directory is not symlink
  - Make sure the custom WAL directory exists and is empty
  - Synchronize new pg_wal to 'pg_new_wal_dir' path
  - Rename pg_wal to pg_wal_old
  - Create symlink
  - Remove 'pg_wal_old' directory
- **Remove existing cluster from DCS**
- **Start Patroni service on the Cluster Leader**
  - Wait for Patroni port to become open on the host
  - Check Patroni is healthy on the Leader
- **Perform RESUME PgBouncer pools on the Leader**
  - Notes: if 'pgbouncer_install' is 'true' and 'pgbouncer_pool_pause' is 'true'
- **Start Patroni service on the Cluster Replica**
  - Wait for Patroni port to become open on the host
  - Check Patroni is healthy on the Replica
- **Perform RESUME PgBouncer pools on the Replica**
  - Notes: if 'pgbouncer_install' is 'true' and 'pgbouncer_pool_pause' is 'true'
- **Check PostgreSQL is started and accepting connections**
- **Disable maintenance mode for HAProxy** (for 'Type A' scheme)
  - Update haproxy conf file
    - Notes: Enable http-checks
  - Reload haproxy service
  - Start confd service
- **Disable maintenance mode for vip-manager** (for 'Type B' scheme)
  - Update vip-manager service file (uncomment 'ExecStopPost')
  - Start vip-manager service
  - Make sure that the cluster ip address (VIP) is running

#### 6. POST-UPGRADE: Analyze a PostgreSQL database (update optimizer statistics) and Post-Upgrade tasks

- **Run vacuumdb to analyze the PostgreSQL databases**
  - Note: Uses parallel processes equal to 50% of CPU cores ('`vacuumdb_parallel_jobs`' variable)
  - Note: Before collecting statistics, the 'pg_terminator' script is launched to monitor and terminate any 'ANALYZE' blockers. Once statistics collection is complete, the script is stopped.
- **Update extensions in each database**
  - Get list of installed PostgreSQL extensions
  - Get list of old PostgreSQL extensions
    - Update old PostgreSQL extensions
      - Notes: excluding: 'pg_repack' and 'pg_stat_kcache' (is exists), as it requires re-creation to update
    - Recreate old pg_stat_statements and pg_stat_kcache extensions to update
      - Notes: if pg_stat_kcache is installed
    - Recreate old pg_repack extension to update
      - Notes: if pg_repack is installed
    - Notes: if there are no old extensions, print message:
      - "The extension versions are up-to-date for the database. No update is required."
- **Perform Post-Checks**
  - Make sure that physical replication is active
    - Note: if no active replication connections found, print error message: "No active replication connections found. Please check the replication status and PostgreSQL logs."
    - Create a table "test_replication" with 10000 rows on the Primary
    - Wait until the PostgreSQL replica is synchronized (max wait time: 2 minutes)
    - Drop a table "test_replication"
    - Print the result of checking the number of records
    - if the number of rows match, print info message: "The PostgreSQL Replication is OK. The number of records in the 'test_replication' table the same as the Primary."
    - if the number of rows does not match, print error message: "The number of records in the 'test_replication' table does not match the Primary. Please check the replication status and PostgreSQL logs."
- **Perform Post-Upgrade tasks**
  - **Ensure the current data directory is the new data directory**
    - Notes: to prevent deletion the old directory if it is used
  - **Delete the old PostgreSQL data directory**
    - Notes: perform pg_dropcluster for Debian based
  - **Delete the old PostgreSQL WAL directory**
    - Notes: if 'pg_new_wal_dir' is defined
  - **Remove old PostgreSQL packages**
    - Notes: if 'pg_old_packages_remove' is 'true'
  - **Remove temporary local access rule from pg_hba.conf**
    - Notes: if it has been changed
    - Update the PostgreSQL configuration
  - **pgBackRest** (if 'pgbackrest_install' is 'true')
    - Check pg-path option
    - Update pg-path in pgbackrest.conf
    - Upgrade stanza
  - **WAL-G** (if 'wal_g_install' is 'true')
    - Update PostgreSQL data directory path in .walg.json
    - Update PostgreSQL data directory path in cron jobs
  - **Wait for the analyze to complete.**
    - Notes: max wait time: 1 hour ('`vacuumdb_analyze_timeout`' variable)
  - **Check the Patroni cluster state**
  - **Check the current PostgreSQL version**
  - **Print info messages**
    - List the Patroni cluster members
    - Upgrade completed
