# Ansible Role: vip_manager

This role installs and configures [vip-manager](https://github.com/cybertec-postgresql/vip-manager), a service that manages virtual IP addresses for PostgreSQL high availability clusters. It provides automatic VIP assignment to the PostgreSQL primary server for seamless application connectivity during failover.

## Description

vip-manager is a lightweight service that automatically manages virtual IP addresses in PostgreSQL HA clusters. Unlike keepalived, which is primarily designed for load balancers, vip-manager is specifically designed for database clusters. This role:

- Installs vip-manager from official packages or repositories
- Configures VIP assignment based on PostgreSQL primary role
- Integrates with Patroni for automatic failover detection
- Manages systemd service for vip-manager lifecycle
- Supports multiple DCS backends (etcd, Consul)
- Provides IP address management without VRRP complexity
- Handles network interface and routing configuration

## Requirements

### Prerequisites

- PostgreSQL cluster managed by Patroni
- Distributed Configuration Store (etcd, Consul, or ZooKeeper)
- Virtual IP address available on the network segment
- Network infrastructure supporting IP address changes
- Appropriate system privileges for IP management

## Role Variables

This role uses variables defined in the `vitabaks.autobase.common` role and Patroni configuration.

### Installation Configuration

```yaml
# vip-manager installation method
vip_manager_package_repo: "https://github.com/cybertec-postgresql/vip-manager/releases/download/v2.2.0/vip-manager_2.2.0_linux_amd64.deb"

# vip-manager version
vip_manager_version: "2.2.0"
```

### Virtual IP Configuration

```yaml
# Virtual IP address for PostgreSQL primary
cluster_vip: "10.0.1.100"

# Network interface for VIP assignment
vip_manager_iface: "{{ ansible_default_ipv4.interface }}"

# VIP netmask (CIDR notation)
vip_manager_mask: 24

# VIP key in DCS (used by Patroni)
vip_manager_key: "/service/{{ patroni_cluster_name }}/leader"
```

### DCS Integration

```yaml
# DCS type (etcd, consul)
dcs_type: "etcd"

# DCS endpoints
dcs_endpoint: "http://{{ groups['etcd_cluster'][0] }}:2379"

# Alternative: multiple endpoints for HA
dcs_endpoints:
  - "http://etcd-01:2379"
  - "http://etcd-02:2379"
  - "http://etcd-03:2379"
```

### Service Configuration

```yaml
# vip-manager configuration file path
vip_manager_conf: "/etc/vip-manager.yml"

# Systemd service configuration
vip_manager_user: "postgres"
vip_manager_group: "postgres"

# Logging configuration
vip_manager_verbose: false
vip_manager_log_level: "INFO"
```

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```


## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Tags

## License

MIT

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
