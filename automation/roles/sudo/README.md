# Ansible Role: sudo

Manages sudo privileges via drop-in files under /etc/sudoers.d for defined users. Supports password-less sudo (NOPASSWD) and command whitelisting.

## Role Variables

| Variable   | Default | Description |
|------------|---------|-------------|
| sudo_users | see below | List of user entries with sudo rules. Each item supports: name (string, required), nopasswd ("yes"/"no"), commands ("ALL" or comma-separated absolute paths). |

Default:
```yaml
sudo_users:
  - name: "postgres"
    nopasswd: "yes" # or "no" to require a password
    commands: "ALL"
#  - name: "joe" # other user (example)
#    nopasswd: "no"
#    commands: "/usr/bin/find, /usr/bin/less, /usr/bin/tail, /bin/kill"
```

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
