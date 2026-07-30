# Ansible Role: resolv_conf

A role to manage system DNS resolvers by ensuring /etc/resolv.conf exists and managing the provided nameserver entries.

## Role Variables

| Variable     | Default | Description |
|--------------|---------|-------------|
| nameservers  | [] | List of DNS servers to manage in /etc/resolv.conf. String items are added. Mapping items accept `entry` and an optional `state` (`present` by default or `absent`). |

Existing string-only configurations remain supported:

```yaml
nameservers:
  - "1.1.1.1"
  - "8.8.8.8"
```

Use a mapping to remove a nameserver entry:

```yaml
nameservers:
  - entry: "1.1.1.1"
    state: present
  - entry: "8.8.8.8"
    state: absent
```

Note: Unlisted lines are not removed or reordered; duplicates are avoided per entry via regexp.

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
