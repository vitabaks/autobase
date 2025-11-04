# Ansible Role: timezone

Sets the system timezone on target hosts. Installs `tzdata` when using package-based installations and applies the timezone via `community.general.timezone` module.

## Role Variables

| Variable            | Default      | Description |
|---------------------|--------------|-------------|
| timezone            | ""           | IANA timezone string (e.g., "Etc/UTC", "Europe/Berlin"). |

Note: The role runs only when timezone variable is non-empty. 

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
