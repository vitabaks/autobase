# Ansible Role: etc_hosts

Adds or updates entries in /etc/hosts on target machines. Useful for PostgreSQL cluster nodes to resolve peers by name without external DNS.

## Variables

| Variable   | Default | Description |
|------------|---------|-------------|
| etc_hosts  | []      | List of full-line host records to ensure in /etc/hosts. Each item should be the exact line you want present (e.g., "10.0.0.11 db1 db1.local"). |

### Example 

```yaml
etc_hosts:
  - "10.128.64.143 pgbackrest.minio.local minio.local s3.eu-west-3.amazonaws.com" 
```

## Notes
- The role uses lineinfile with a regexp anchored to the beginning of the line, matching the provided text. Provide the full desired line to avoid duplicates.
- unsafe_writes is enabled to avoid CI-related file lock issues.

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
