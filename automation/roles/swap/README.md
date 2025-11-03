# Ansible Role: swap

Manages system swap via a swap file. Creates, resizes, or removes the swap file when needed, adds it to /etc/fstab, and enables it with swapon.

## Role Variables

| Variable            | Default    | Description |
|---------------------|------------|-------------|
| swap_file_create    | true       | Master toggle. If false, the role does nothing. |
| swap_file_path      | /swapfile  | Path to the swap file. |
| swap_file_size_mb   | "4096"     | Desired swap file size in megabytes. If different from current, the role recreates the swap. |

Notes:
- Skips on virtualization types: container, docker, lxc, podman.

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
