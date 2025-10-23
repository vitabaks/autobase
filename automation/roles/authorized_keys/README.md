# Ansible Role: authorized_keys

Adds SSH public keys to ~/.ssh/authorized_keys of the remote user detected via `whoami`.

## Description
- Detects target user with `whoami` on the managed host.
- Ensures ~/.ssh and authorized_keys exist with secure permissions.
- Idempotent: adds keys without duplicates or removing other keys.

## Role Variables

| Variable          | Type          | Default    | Description |
|-------------------|---------------|------------|-------------|
| ssh_public_keys   | string or list| undefined  | Public key(s) to add. Accepts a list of key lines or a single string; if string, keys may be separated by newlines or commas. Extra quotes are stripped. If undefined/empty, the role does nothing. |

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

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
