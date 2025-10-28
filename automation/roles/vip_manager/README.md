# Ansible Role: vip_manager

This role installs and configures [vip-manager](https://github.com/cybertec-postgresql/vip-manager), a service that manages virtual IP addresses for PostgreSQL high availability clusters. It provides automatic VIP assignment to the PostgreSQL primary server for seamless application connectivity during failover.

## Role Variables

| Variable | Default | Description |
|---|---|---|
| vip_manager_version | 3.0.0 | vip-manager version to install. |
| vip_manager_package_repo | `https://github.com/cybertec-postgresql/vip-manager/releases/download/v{{ vip_manager_version }}/vip-manager_{{ vip_manager_version }}_Linux_{{ vip_manager_architecture_map[ansible_architecture] }}.{{ pkg_type }}` | Package URL (deb/rpm). |
| vip_manager_conf | /etc/patroni/vip-manager.yml | Config file path. |
| vip_manager_interval | 1000 | Check interval in milliseconds. |
| vip_manager_iface | `{{ vip_interface }}` | Network interface to bind the VIP. |
| vip_manager_ip | `{{ cluster_vip }}` | VIP address to manage. |
| vip_manager_mask | 24 | VIP netmask (CIDR). |
| vip_manager_dcs_type | `{{ dcs_type }}` | DCS backend type: etcd, consul, or patroni. Default: "etcd"|
| vip_interface | `{{ ansible_default_ipv4.interface }}` | Default interface used to derive vip_manager_iface. |
| cluster_vip | "" | Cluster VIP. Required for actual VIP management. |

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
