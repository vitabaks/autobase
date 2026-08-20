# Ansible Role: hostname

Sets the system hostname and ensures it is reflected in /etc/hosts for local resolution on PostgreSQL cluster nodes.

## Variables

| Variable | Default | Description |
|----------|---------|-------------|
| hostname | "" | Desired system hostname (e.g., pgnode01). |

## Behavior
- Uses the Ansible hostname module to set the hostname.
- Rewrites the `127.0.0.1` line in `/etc/hosts` so `ansible_hostname` is the first alias and `localhost` is the second. This makes `hostname -f` return the short hostname (glibc's FQDN resolution returns the first alias on the matching `/etc/hosts` line) instead of `localhost`, preventing duplicate-FQDN issues across cluster nodes.

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations

