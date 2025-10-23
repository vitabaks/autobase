# Ansible Role: pam_limits

Configures per-user file descriptor limits (nofile) via community.general.pam_limits

## Role Variables

| Variable | Default | Description |
|---|---|---|
| set_limits | true | Enable applying PAM limits. When false, the role does nothing. |
| limits_user | "postgres" | System user for which limits are applied. |
| soft_nofile | 65536 | Soft nofile limit. |
| hard_nofile | 200000 | Hard nofile limit. |

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
