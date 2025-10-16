# Ansible Role: hostname

Sets the system hostname and ensures it is reflected in /etc/hosts for local resolution on PostgreSQL cluster nodes.

## Variables

| Variable | Default | Description |
|----------|---------|-------------|
| hostname | "" | Desired system hostname (e.g., pgnode01). |

## Behavior
- Uses the Ansible hostname module to set the hostname.
- Adds/updates the localhost line in /etc/hosts to include the current ansible_hostname.

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations

