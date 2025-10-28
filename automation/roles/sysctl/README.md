# Ansible Role: sysctl

Configures Linux kernel parameters via sysctl for PostgreSQL and related components. The role composes parameters dynamically from group-based mappings and applies them persistently.

## Description
- Collects sysctl entries from sysctl_conf for all groups the host belongs to.
- Flattens and de-duplicates entries, then applies them via ansible.posix.sysctl.
- Persists settings under sysctl_file and reloads sysctl.

## Role Variables

| Variable    | Default | Type | Description |
|-------------|---------|------|-------------|
| sysctl_set  | true    | bool | Master toggle. If false, the role does nothing. |
| sysctl_file | /etc/sysctl.d/autobase.sysctl.conf | path | Destination file for persistent sysctl settings. |
| sysctl_conf | see common defaults | dict | Mapping of group name -> list of {name, value} entries. Keys commonly used in this project: etcd_cluster, consul_instances, master, replica, pgbackrest, postgres_cluster, balancers. |

Notes on sysctl_conf:
- Example structure (see roles/common/defaults/main.yml for the full list and defaults):
  - postgres_cluster: includes memory, networking, and scheduler-tuning (e.g., vm.swappiness, net.core.somaxconn, etc.).
  - balancers: network tuning for HAProxy hosts.
  - etcd_cluster/consul_instances: I/O and network tuning for DCS nodes.
- You may add your own group keys; the role automatically picks them up if the host is a member of those groups.

Example:
```yaml
sysctl_set: true
sysctl_file: /etc/sysctl.d/autobase.sysctl.conf
sysctl_conf:
  etcd_cluster: []
  master: []
  replica: []
  postgres_cluster:
    - { name: "vm.overcommit_memory", value: "2" }
    - { name: "vm.swappiness", value: "1" }
    - { name: "vm.min_free_kbytes", value: "102400" }
    - { name: "vm.dirty_expire_centisecs", value: "1000" }
    - { name: "vm.dirty_background_bytes", value: "67108864" }
    - { name: "vm.dirty_bytes", value: "536870912" }
    - { name: "vm.nr_hugepages", value: "9510" }  # ~18GB
    - { name: "vm.zone_reclaim_mode", value: "0" }
    - { name: "kernel.numa_balancing", value: "0" }
    - { name: "kernel.sched_autogroup_enabled", value: "0" }
    - { name: "net.ipv4.ip_nonlocal_bind", value: "1" }
    - { name: "net.ipv4.ip_forward", value: "1" }
    - { name: "net.ipv4.ip_local_port_range", value: "10000 65535" }
    - { name: "net.core.netdev_max_backlog", value: "10000" }
    - { name: "net.ipv4.tcp_max_syn_backlog", value: "8192" }
    - { name: "net.core.somaxconn", value: "65535" }
    - { name: "net.ipv4.tcp_tw_reuse", value: "1" }
  balancers:
    - { name: "net.ipv4.ip_nonlocal_bind", value: "1" }
    - { name: "net.ipv4.ip_forward", value: "1" }
    - { name: "net.ipv4.ip_local_port_range", value: "10000 65535" }
    - { name: "net.core.netdev_max_backlog", value: "10000" }
    - { name: "net.ipv4.tcp_max_syn_backlog", value: "8192" }
    - { name: "net.core.somaxconn", value: "65535" }
    - { name: "net.ipv4.tcp_tw_reuse", value: "1" }
```

## Dependencies
- Variables provided by roles/common/defaults/main.yml (this repository).
