# Ansible Role: authorized_keys

Adds or removes SSH public keys in ~/.ssh/authorized_keys of the remote user detected via `whoami`.

## Description
- Detects target user with `whoami` on the managed host.
- Ensures ~/.ssh and authorized_keys exist with secure permissions.
- Idempotent: manages only explicitly listed keys without affecting other keys.

## Role Variables

| Variable          | Type          | Default    | Description |
|-------------------|---------------|------------|-------------|
| ssh_public_keys   | string or list| []         | Public keys to manage. String items are added. Mapping items accept `entry` and an optional `state` (`present` by default or `absent`). A single string may contain keys separated by newlines or commas. Extra quotes are stripped. |

Note: The target user is the actual SSH user (resolved via `whoami`) and cannot be overridden by a variable.

## Examples

List of keys:
```yaml
ssh_public_keys:
  - "ssh-ed25519 AAAAC3... user1@example"
  - "ssh-rsa AAAAB3... user2@example"
```

Single string (newline-separated):
```yaml
ssh_public_keys: |
  ssh-ed25519 AAAAC3... user1@example
  ssh-rsa AAAAB3... user2@example
```

Use a mapping to remove a key:

```yaml
ssh_public_keys:
  - entry: "ssh-ed25519 AAAAC3... user1@example"
    state: present
  - entry: "ssh-rsa AAAAB3... user2@example"
    state: absent
```

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
