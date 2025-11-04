# Ansible Role: ssh_keys

Configures SSH key-based authentication for a specified user across the cluster:
- Ensures OpenSSH client packages are installed on Debian/RedHat.
- Ensures the user exists and generates a 2048-bit SSH key if missing.
- Collects each host’s public key and appends all collected keys to the user’s authorized_keys.
- Populates known_hosts using ssh-keyscan for the provided hosts.

## Role Variables

| Variable | Default | Description |
|---------|---------|-------------|
| enable_ssh_key_based_authentication | false | Master toggle for the role. |
| ssh_key_user | postgres | User to manage SSH keys for. |
| ssh_key_state | present | State for authorized_key entries (present/absent). |
| ssh_known_hosts | `{{ groups['postgres_cluster'] }}` | List of hosts to scan and add to known_hosts. |

Behavior notes:
- Public keys are fetched from each host: ~ssh_key_user/.ssh/id_rsa.pub -> files_dir/<hostname>-id_rsa.pub.
- All files matching files_dir/*id_rsa.pub are appended to ~ssh_key_user/.ssh/authorized_keys.

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
