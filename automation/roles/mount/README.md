# Ansible Role: mount

This role configures filesystems and mount points:
- Optionally auto-detects an empty disk in cloud environments, creates a filesystem, reads its UUID, writes /etc/fstab, and mounts it.
- Supports standard filesystems (ext4 by default) and ZFS. When fstype is zfs, it installs ZFS packages, loads the module, and creates a zpool with sensible defaults.

## Role Variables

| Variable | Default | Description |
|---|---|---|
| mount | [] | List of mount definitions. Each item may include: path, src, fstype, opts, state. See below for item fields. |
| mount[].path | "/pgdata" | Mount point path. Used as fallback for the first item when auto-provisioning. |
| mount[].src | "" | Device UUID=... or device path. If empty and cloud_provider is set, the role will try to detect an empty disk and fill the UUID automatically for the first item. |
| mount[].fstype | "ext4" | Filesystem type (e.q., ext4, xfs). Use "zfs" to create a zpool and mount it. |
| mount[].opts | "defaults,noatime" | Mount options (not applicable to zfs creation). |
| mount[].state | "mounted" | Desired state (mounted, present, absent, etc.). |
| pg_data_mount_path | "/pgdata" | Default path used when auto-provisioning or for the ZFS mountpoint. |
| pg_data_mount_fstype | "ext4" | Filesystem type to create when auto-provisioning the first disk. Set to "zfs" to create a zpool. |

Notes:
- The role relies on lsblk and jq for disk detection; ensure jq is available (it is installed by the common role by default).
- ZFS packages are installed per OS family (Ubuntu/Debian/RedHat) and the zfs module is loaded automatically.

## Example:

```yaml
mount:
  - path: "/pgdata"
    src: "f58db4cd-64fe-4116-a0cb-190e4ed9997d" # /dev/nvme0n1
    fstype: "ext4"
    opts: "defaults,noatime"
    state: "mounted"
  - path: "/pgwal"
    src: "dc3674d2-7170-41d8-af2b-a6e56486dda8" # /dev/nvme1n1
    fstype: "ext4"
    opts: "defaults"
    state: "mounted"
```

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
