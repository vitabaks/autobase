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

## Example Playbook

### Basic PostgreSQL Database Optimization

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    sysctl_set: true
  roles:
    - vitabaks.autobase.sysctl
```

### Custom Kernel Parameters

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    sysctl_set: true
    
    # Custom parameters for high-performance systems
    sysctl_conf:
      postgres_cluster:
        # Memory optimization for 64GB+ RAM systems
        - {name: "vm.swappiness", value: "1"}
        - {name: "vm.dirty_background_ratio", value: "3"}
        - {name: "vm.dirty_ratio", value: "5"}
        - {name: "vm.dirty_expire_centisecs", value: "3000"}
        - {name: "vm.dirty_writeback_centisecs", value: "100"}
        
        # Shared memory for large PostgreSQL instances
        - {name: "kernel.shmmax", value: "137438953472"}  # 128GB
        - {name: "kernel.shmall", value: "33554432"}      # 128GB/4KB
        
        # Network optimization for high connection counts
        - {name: "net.core.somaxconn", value: "32768"}
        - {name: "net.ipv4.tcp_max_syn_backlog", value: "32768"}
        - {name: "net.core.netdev_max_backlog", value: "30000"}
        
        # TCP optimization
        - {name: "net.ipv4.tcp_congestion_control", value: "bbr"}
        - {name: "net.core.default_qdisc", value: "fq"}
        
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.sysctl
```

### Multi-Group Configuration

```yaml
---
- hosts: all
  become: yes
  vars:
    sysctl_set: true
    
    sysctl_conf:
      # Settings for all PostgreSQL database servers
      postgres_cluster:
        - {name: "vm.swappiness", value: "1"}
        - {name: "vm.dirty_background_ratio", value: "5"}
        - {name: "kernel.shmmax", value: "68719476736"}
        
      # Settings for HAProxy load balancers
      balancers:
        - {name: "net.core.somaxconn", value: "65535"}
        - {name: "net.ipv4.tcp_max_syn_backlog", value: "65535"}
        - {name: "net.ipv4.ip_local_port_range", value: "1024 65535"}
        
      # Settings for etcd cluster members
      etcd_cluster:
        - {name: "vm.dirty_background_ratio", value: "3"}
        - {name: "net.core.rmem_default", value: "262144"}
        
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.sysctl
```

### Production Environment with NUMA Optimization

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    sysctl_set: true
    
    sysctl_conf:
      postgres_cluster:
        # Memory management for NUMA systems
        - {name: "vm.swappiness", value: "1"}
        - {name: "vm.zone_reclaim_mode", value: "0"}
        - {name: "vm.dirty_background_ratio", value: "3"}
        - {name: "vm.dirty_ratio", value: "5"}
        
        # Large page support
        - {name: "vm.nr_hugepages", value: "1024"}        # 2GB huge pages
        - {name: "kernel.shmmax", value: "274877906944"}  # 256GB
        - {name: "kernel.shmall", value: "67108864"}      # 256GB/4KB
        
        # Process and file limits
        - {name: "kernel.pid_max", value: "4194304"}
        - {name: "fs.file-max", value: "26234400"}
        
        # Network tuning for high throughput
        - {name: "net.core.rmem_max", value: "268435456"}  # 256MB
        - {name: "net.core.wmem_max", value: "268435456"}  # 256MB
        - {name: "net.ipv4.tcp_rmem", value: "8192 262144 268435456"}
        - {name: "net.ipv4.tcp_wmem", value: "8192 262144 268435456"}
        
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.sysctl
```

## Parameter Categories and Explanations

### Memory Management Parameters

#### Virtual Memory Behavior
```yaml
# Swap usage control (lower values prefer RAM over swap)
- {name: "vm.swappiness", value: "1"}           # 0-100, default 60

# Dirty page management (controls write caching)
- {name: "vm.dirty_background_ratio", value: "5"}  # Start background writes at 5%
- {name: "vm.dirty_ratio", value: "10"}            # Force synchronous writes at 10%
- {name: "vm.dirty_expire_centisecs", value: "6000"} # Dirty pages expire after 60s
- {name: "vm.dirty_writeback_centisecs", value: "500"} # Check every 5s
```

#### Shared Memory Settings
```yaml
# Maximum shared memory segment size (bytes)
- {name: "kernel.shmmax", value: "68719476736"}    # 64GB

# Total shared memory pages (4KB pages)
- {name: "kernel.shmall", value: "16777216"}       # 64GB / 4KB

# Semaphore limits (SEMMSL, SEMMNS, SEMOPM, SEMMNI)
- {name: "kernel.sem", value: "250 32000 100 128"}
```

### Network Performance Parameters

#### Core Network Settings
```yaml
# Maximum socket listen backlog
- {name: "net.core.somaxconn", value: "65535"}

# Maximum receive/send buffer sizes
- {name: "net.core.rmem_max", value: "134217728"}  # 128MB
- {name: "net.core.wmem_max", value: "134217728"}  # 128MB

# Default buffer sizes
- {name: "net.core.rmem_default", value: "262144"} # 256KB
- {name: "net.core.wmem_default", value: "262144"} # 256KB
```

#### TCP Optimization
```yaml
# TCP buffer sizes (min, default, max)
- {name: "net.ipv4.tcp_rmem", value: "4096 87380 134217728"}
- {name: "net.ipv4.tcp_wmem", value: "4096 65536 134217728"}

# Connection handling
- {name: "net.ipv4.tcp_max_syn_backlog", value: "65535"}
- {name: "net.ipv4.tcp_fin_timeout", value: "30"}
- {name: "net.ipv4.tcp_keepalive_time", value: "120"}

# Port range for outgoing connections
- {name: "net.ipv4.ip_local_port_range", value: "1024 65535"}
```

### I/O and Filesystem Parameters

#### I/O Scheduling
```yaml
# Read-ahead for block devices (KB)
- {name: "vm.dirty_background_bytes", value: "67108864"}  # 64MB

# Maximum memory for dirty pages before blocking
- {name: "vm.dirty_bytes", value: "134217728"}           # 128MB
```

#### File System Limits
```yaml
# Maximum number of open files
- {name: "fs.file-max", value: "26234400"}

# Maximum number of processes
- {name: "kernel.pid_max", value: "4194304"}

# Inotify limits
- {name: "fs.inotify.max_user_watches", value: "1048576"}
```

## Dynamic Configuration

The role automatically applies parameters based on server group membership:

```yaml
# Inventory groups determine which parameters are applied
[postgres_cluster]
db-01 ansible_host=10.0.1.10
db-02 ansible_host=10.0.1.11

[balancers]
haproxy-01 ansible_host=10.0.2.10

[etcd_cluster]  
etcd-01 ansible_host=10.0.3.10
```

Each server receives parameters for all groups it belongs to, with unique values preserved.

## Performance Tuning Guidelines

### Memory-Intensive Workloads
```yaml
# For systems with 64GB+ RAM
- {name: "vm.swappiness", value: "1"}
- {name: "vm.dirty_background_ratio", value: "3"}
- {name: "vm.dirty_ratio", value: "5"}
- {name: "kernel.shmmax", value: "137438953472"}  # 128GB
```

### High-Connection Workloads
```yaml
# For systems handling thousands of connections
- {name: "net.core.somaxconn", value: "65535"}
- {name: "net.ipv4.tcp_max_syn_backlog", value: "65535"}
- {name: "net.ipv4.ip_local_port_range", value: "1024 65535"}
```

### I/O-Intensive Workloads
```yaml
# For systems with high write loads
- {name: "vm.dirty_background_ratio", value: "3"}
- {name: "vm.dirty_ratio", value: "5"}
- {name: "vm.dirty_expire_centisecs", value: "3000"}
- {name: "vm.dirty_writeback_centisecs", value: "100"}
```

## Validation and Monitoring

### Check Current Values
```bash
# View all sysctl parameters
sysctl -a | grep -E "(vm\.|net\.|kernel\.)"

# Check specific parameter
sysctl vm.swappiness
sysctl net.core.somaxconn
sysctl kernel.shmmax

# View applied changes
sysctl -p
```

### Monitor Parameter Effects
```bash
# Memory usage
free -h
cat /proc/meminfo

# Network statistics  
ss -s
cat /proc/net/sockstat

# Shared memory usage
ipcs -m
```

## Common Parameter Values by Workload

### Small Systems (< 16GB RAM)
```yaml
- {name: "vm.swappiness", value: "10"}
- {name: "kernel.shmmax", value: "17179869184"}    # 16GB
- {name: "kernel.shmall", value: "4194304"}        # 16GB/4KB
```

### Medium Systems (16-64GB RAM)
```yaml
- {name: "vm.swappiness", value: "5"}
- {name: "kernel.shmmax", value: "68719476736"}    # 64GB
- {name: "kernel.shmall", value: "16777216"}       # 64GB/4KB
```

### Large Systems (64GB+ RAM)
```yaml
- {name: "vm.swappiness", value: "1"}
- {name: "kernel.shmmax", value: "274877906944"}   # 256GB
- {name: "kernel.shmall", value: "67108864"}       # 256GB/4KB
```

## Error Handling and Safety

### Parameter Validation
- Role uses `ignore_errors: true` to prevent failures on invalid parameters
- Parameters are applied individually to isolate issues
- Reload is performed to ensure persistence

### Recovery Procedures
```bash
# Reset to defaults if issues occur
echo "vm.swappiness = 60" >> /etc/sysctl.conf
sysctl -p

# Temporarily change parameter
sysctl -w vm.swappiness=30

# Revert all changes (requires reboot)
rm /etc/sysctl.d/99-postgresql.conf
reboot
```

## Integration with PostgreSQL Stack

### Patroni Integration
The role coordinates with Patroni configuration to ensure kernel parameters support PostgreSQL settings:

```yaml
# Ensure shared memory supports PostgreSQL shared_buffers
kernel.shmmax ≥ shared_buffers + other_memory_needs
```

### Connection Pooling Integration
Parameters are tuned for PgBouncer connection pooling:

```yaml
# Support high connection counts through pooler
net.core.somaxconn ≥ max_pool_size * pool_count
```

## Troubleshooting

### Common Issues

1. **Parameters not taking effect**
   - Check `/proc/sys/` values after application
   - Verify no conflicting parameters in other files
   - Ensure proper reload with `sysctl -p`

2. **Memory allocation failures**
   - Verify `kernel.shmmax` and `kernel.shmall` are sufficient
   - Check available memory vs. configured limits
   - Review PostgreSQL shared memory requirements

3. **Network performance issues**
   - Confirm network buffer sizes match workload
   - Check `net.core.somaxconn` vs. application requirements
   - Monitor dropped connections and retransmissions

### Debug Commands
```bash
# Check if parameters are active
sysctl -a | grep dirty
sysctl -a | grep tcp_rmem

# Verify shared memory limits
ipcs -l

# Monitor network buffer usage
ss -m
```

## Tags

Use these tags to run specific parts of the role:

- `sysctl`: Apply kernel parameter configuration
- `kernel`: Same as sysctl (alias)

### Example with Tags

```bash
# Apply kernel parameters only
ansible-playbook playbook.yml --tags sysctl
```

## Best Practices

### Parameter Planning
- Test parameter changes in staging environment first
- Monitor system behavior after parameter changes
- Document the rationale for each parameter change
- Use conservative values initially

### Performance Optimization
- Tune parameters based on actual workload patterns
- Monitor key metrics before and after changes
- Adjust parameters incrementally
- Consider hardware specifications when setting limits

### Maintenance
- Review and update parameters during system upgrades
- Keep parameter documentation current
- Monitor for kernel parameter deprecations
- Regular validation of parameter effectiveness

## License

MIT

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
