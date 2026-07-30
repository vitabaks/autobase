# Ansible Role: etc_hosts

Adds, updates, or removes entries in /etc/hosts on target machines. Useful for PostgreSQL cluster nodes to resolve peers by name without external DNS.

## Variables

| Variable   | Default | Description |
|------------|---------|-------------|
| etc_hosts  | []      | List of full-line host records to manage in /etc/hosts. String items are added. Mapping items accept `entry` and an optional `state` (`present` by default or `absent`). |

### Example 

```yaml
etc_hosts:
  - "10.128.64.143 pgbackrest.minio.local minio.local s3.eu-west-3.amazonaws.com" 
```

Use a mapping to remove an entry:

```yaml
etc_hosts:
  - entry: "10.0.0.11 db1 db1.local"
    state: present
  - entry: "10.0.0.12 db2 db2.local"
    state: absent
```

## Notes
- The role matches the full provided entry. Provide the full line to add or remove.
- unsafe_writes is enabled to avoid CI-related file lock issues.

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
