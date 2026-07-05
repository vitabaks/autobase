# Ansible Role: resizefs

This role grows the block device and filesystem when the underlying disk or volume has available space.

It resolves the filesystem device and type with `findmnt` and `lsblk`, grows the partition with `community.general.parted` and grows filesystems with `community.general.filesystem`.

## Role Variables

| Variable | Default | Description |
|---|---|---|
| resizefs_enabled | false | Enable automatic resize checks. |
| resizefs_target_path | `{{ postgresql_data_dir }}` | Path used to find the mounted filesystem to resize. If the exact path does not exist yet, the nearest existing parent path is used. |

## Notes

- LVM is not supported yet; this role skips LVM.
