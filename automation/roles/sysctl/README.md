# Ansible Role: sysctl

This role configures Linux kernel parameters via sysctl for optimal PostgreSQL database performance and system behavior. It provides dynamic kernel parameter management based on server roles and requirements.

## Description

System kernel parameters significantly impact PostgreSQL performance, memory management, and network behavior. This role:

- Configures kernel parameters dynamically based on server group membership
- Optimizes memory management settings for PostgreSQL workloads
- Tunes network parameters for high-performance database connections
- Sets filesystem and I/O parameters for optimal database performance
- Provides role-specific parameter sets for different server types
- Ensures parameter persistence across reboots

## Requirements

### Prerequisites

- Root privileges for kernel parameter modification
- Understanding of kernel parameter impacts on system behavior
- Proper resource planning for memory and I/O settings

### Operating System Support

- **Debian**: 11, 12, 13
- **Ubuntu**: 22.04, 24.04
- **CentOS Stream**: 9, 10
- **Oracle Linux**: 8, 9, 10
- **Rocky Linux**: 8, 9, 10
- **AlmaLinux**: 8, 9, 10

- **Debian/Ubuntu**: 18.04, 20.04, 22.04, 24.04
- **RHEL/CentOS/Rocky/AlmaLinux**: 8, 9
- **Amazon Linux**: 2023

## Role Variables

This role uses variables defined in the `vitabaks.autobase.common` role.

### Main Configuration

```yaml
# Enable/disable sysctl configuration
sysctl_set: true

# Dynamic sysctl configuration based on group membership
sysctl_conf: {}  # Populated from common role defaults
```

### Kernel Parameter Categories

The role organizes parameters by server group and function:

#### PostgreSQL Database Servers
```yaml
sysctl_conf:
  postgres_cluster:
    # Memory management
    - {name: "vm.swappiness", value: "1"}
    - {name: "vm.dirty_background_ratio", value: "5"}
    - {name: "vm.dirty_ratio", value: "10"}
    - {name: "vm.dirty_expire_centisecs", value: "6000"}
    - {name: "vm.dirty_writeback_centisecs", value: "500"}
    
    # Shared memory and semaphores
    - {name: "kernel.shmmax", value: "68719476736"}    # 64GB
    - {name: "kernel.shmall", value: "16777216"}       # 64GB/4KB
    - {name: "kernel.sem", value: "250 32000 100 128"}
    
    # Network optimization
    - {name: "net.core.rmem_max", value: "134217728"}
    - {name: "net.core.wmem_max", value: "134217728"}
    - {name: "net.ipv4.tcp_rmem", value: "4096 87380 134217728"}
    - {name: "net.ipv4.tcp_wmem", value: "4096 65536 134217728"}
```

#### Load Balancers (HAProxy)
```yaml
sysctl_conf:
  balancers:
    # Network performance
    - {name: "net.core.somaxconn", value: "65535"}
    - {name: "net.ipv4.tcp_max_syn_backlog", value: "65535"}
    - {name: "net.ipv4.ip_local_port_range", value: "1024 65535"}
    - {name: "net.ipv4.tcp_fin_timeout", value: "30"}
    - {name: "net.ipv4.tcp_keepalive_time", value: "120"}
    
    # Connection tracking
    - {name: "net.netfilter.nf_conntrack_max", value: "1048576"}
    - {name: "net.netfilter.nf_conntrack_tcp_timeout_established", value: "1800"}
```

#### etcd Cluster Members
```yaml
sysctl_conf:
  etcd_cluster:
    # I/O optimization for etcd
    - {name: "vm.dirty_background_ratio", value: "3"}
    - {name: "vm.dirty_ratio", value: "5"}
    - {name: "vm.dirty_expire_centisecs", value: "3000"}
    - {name: "vm.dirty_writeback_centisecs", value: "100"}
    
    # Network tuning
    - {name: "net.core.rmem_default", value: "262144"}
    - {name: "net.core.wmem_default", value: "262144"}
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
