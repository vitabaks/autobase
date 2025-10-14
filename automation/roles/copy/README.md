# Ansible Role: copy

Fetch files from the first host in the master group and copy them to all target hosts.

## Variables

| Variable | Default | Description |
|----------|---------|-------------|
| fetch_files_from_master | [] | Fetch files from the server in the "master" group. These files can later be copied to all servers |
| copy_files_to_all_server | [] | Copy this files to all servers in the cluster ("master" and "replica" groups) |

### Examples:

Copy the certificate files from the primary node to the replicas

```yaml
fetch_files_from_master:
  - { src: "/etc/ssl/certs/ssl-cert-snakeoil.pem", dest: "files/ssl-cert-snakeoil.pem" }
  - { src: "/etc/ssl/private/ssl-cert-snakeoil.key", dest: "files/ssl-cert-snakeoil.key" }

copy_files_to_all_server:
  - { src: "files/ssl-cert-snakeoil.pem", dest: "/etc/ssl/certs/ssl-cert-snakeoil.pem", owner: "postgres", group: "postgres", mode: "0644" }
  - { src: "files/ssl-cert-snakeoil.key", dest: "/etc/ssl/private/ssl-cert-snakeoil.key", owner: "postgres", group: "postgres", mode: "0600" }
```

Copy the [pg_auto_reindexer](https://github.com/vitabaks/pg_auto_reindexer) script from the files directory to the cluster nodes

```yaml
copy_files_to_all_server:
  - { src: "files/pg_auto_reindexer", dest: "/usr/local/bin/pg_auto_reindexer", owner: "postgres", group: "postgres", mode: "0750" }
```

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
