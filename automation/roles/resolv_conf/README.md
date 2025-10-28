# Ansible Role: resolv_conf

A role to manage system DNS resolvers by ensuring /etc/resolv.conf exists and contains the provided nameserver entries.

## Role Variables

| Variable     | Default | Description |
|--------------|---------|-------------|
| nameservers  | not set (role does nothing if empty) | List of DNS servers to add to /etc/resolv.conf (e.g., ["1.1.1.1", "8.8.8.8"]). If inherited from the common role, the default is Cloudflare + Google. |

Note: Existing lines are not removed or reordered; duplicates are avoided per entry via regexp.

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
