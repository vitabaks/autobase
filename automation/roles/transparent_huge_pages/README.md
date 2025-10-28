# Ansible Role: transparent_huge_pages

Disables Linux Transparent Huge Pages (THP) for better PostgreSQL performance. The role creates and enables a systemd service that sets THP and defrag to "never".

## Role Variables

| Variable    | Default | Description |
|-------------|---------|-------------|
| disable_thp | true    | When true, installs/enables a systemd service to disable THP and THP defrag. When false, the role does nothing. |

## Notes
- Idempotent; updates the unit at /etc/systemd/system/disable-transparent-huge-pages.service
- Not executed on virtualization types: container, docker, lxc, podman.

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
