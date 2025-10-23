# Ansible Role: cron

Installs cron service and manages cron jobs for PostgreSQL cluster hosts.

## Variables

| Variable | Default | Description |
|----------|---------|-------------|
| cron_jobs | [] | List of cron entries to manage. |

Note: When empty, no packages are installed and no changes are made.

## Item structure

Each item supports the following keys (defaults reflect the role logic):

- name: string (required) — Cron job identifier.
- job: string (required) — Command to execute.
- user: "postgres" — System user to run the job as.
- file: "" — Custom cron file name (placed in /etc/cron.d when supported).
- minute: "*" — Cron minute field.
- hour: "*" — Cron hour field.
- day: "*" — Cron day-of-month field.
- month: "*" — Cron month field.
- weekday: "*" — Cron day-of-week field.
- disabled: false — If true, the job is installed but disabled.
- state: "present" — Use "present" to add/update and "absent" to remove job.

### Example:

```yaml
cron_jobs:
  - name: "pg_auto_reindexer"
    user: "root"
    file: /etc/cron.d/pg_auto_reindexer
    minute: "1"
    hour: "0"
    day: "*"
    month: "*"
    weekday: "*"
    job: "/usr/local/bin/pg_auto_reindexer --index-bloat=30 --maintenance-start=0000 --maintenance-stop=0600"
```

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
