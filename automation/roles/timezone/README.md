# Ansible Role: timezone

Sets the system timezone on target hosts. Installs `tzdata` when using package-based installations and applies the timezone via `community.general.timezone` module.

## Role Variables

| Variable            | Default      | Description |
|---------------------|--------------|-------------|
| timezone            | ""           | IANA timezone string (e.g., "Etc/UTC", "Europe/Berlin"). |

Note: The role runs only when timezone variable is non-empty. 

## Dependencies
- Variables provided by roles/common/defaults/main.yml (this repository).
