# Ansible Role: keepalived

This role installs and configures [Keepalived](https://www.keepalived.org/), a routing software providing high availability for HAProxy load balancers through VRRP (Virtual Router Redundancy Protocol). It ensures continuous load balancer availability for PostgreSQL clusters.

## Description

Keepalived provides high availability for load balancers by managing virtual IP addresses and automatic failover. This role:

- Installs keepalived from system repositories
- Configures VRRP instances for virtual IP management
- Sets up health check scripts for HAProxy monitoring
- Manages master/backup failover logic
- Configures network kernel parameters for VRRP operation
- Integrates with HAProxy for PostgreSQL load balancer HA
- Provides script-based service health monitoring

## Requirements

### Prerequisites

- Two or more load balancer nodes for HA setup
- Virtual IP address available on the network
- Network infrastructure supporting VRRP multicast
- HAProxy or other load balancer service running
- Proper network routing and VLAN configuration

### Operating System Support

- **Debian/Ubuntu**: 18.04, 20.04, 22.22, 24.04
- **RHEL/CentOS/Rocky/AlmaLinux**: 8, 9  
- **Amazon Linux**: 2023

## Role Variables

This role uses variables defined in the `vitabaks.autobase.common` role and HAProxy configuration.

### VRRP Configuration

```yaml
# Virtual Router ID (must be unique per network segment)
keepalived_vrrp_instance_name: "VI_1"
vrrp_router_id: 51

# Virtual IP address
cluster_vip: "10.0.1.100"              # Virtual IP for load balancer cluster

# Network interface for VRRP
vrrp_interface: "{{ ansible_default_ipv4.interface }}"

# VRRP authentication
vrrp_auth_type: "PASS"                  # PASS or AH
vrrp_auth_pass: "{{ cluster_vip }}"     # Authentication password
```

### Priority and Failover

```yaml
# VRRP priority (higher value = preferred master)
keepalived_priority_master: 110         # Master node priority
keepalived_priority_backup: 100         # Backup node priority

# Failover timing
vrrp_advert_int: 1                      # Advertisement interval (seconds)
vrrp_preempt_delay: 10                  # Delay before preemption (seconds)
```

### Health Check Configuration

```yaml
# HAProxy health check script
keepalived_track_script_name: "haproxy_check"
keepalived_track_script_path: "/usr/libexec/keepalived/haproxy_check.sh"

# Health check parameters
keepalived_check_interval: 2            # Check every 2 seconds
keepalived_check_fall: 3                # Failures before marking down
keepalived_check_rise: 2                # Successes before marking up
```

### Network Configuration

```yaml
# Kernel parameters (automatically configured)
net.ipv4.ip_nonlocal_bind: 1            # Allow binding to non-local IPs
net.ipv4.ip_forward: 1                  # Enable IP forwarding
```

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Example Playbook

### Basic High-Availability Load Balancer Setup

```yaml
---
- hosts: balancers
  become: yes
  vars:
    cluster_vip: "10.0.1.100"
    vrrp_router_id: 51
    
    # Set priorities (first host becomes master)
    keepalived_priority_master: "{{ 110 if ansible_hostname == groups['balancers'][0] else 100 }}"
    
  roles:
    - vitabaks.autobase.haproxy
    - vitabaks.autobase.keepalived
```

### Production HA Setup with Custom Health Checks

```yaml
---
- hosts: balancers
  become: yes
  vars:
    # Virtual IP configuration
    cluster_vip: "192.168.1.100"
    vrrp_router_id: 51
    vrrp_interface: "eth0"
    
    # VRRP authentication
    vrrp_auth_type: "PASS"
    vrrp_auth_pass: "MySecureVrrpKey123"
    
    # Priority-based failover
    keepalived_priority_master: "{{ 120 if inventory_hostname == groups['balancers'][0] else 110 if inventory_hostname == groups['balancers'][1] else 100 }}"
    
    # Fine-tuned timing
    vrrp_advert_int: 1
    vrrp_preempt_delay: 5
    
    # Enhanced health checking
    keepalived_check_interval: 1
    keepalived_check_fall: 2
    keepalived_check_rise: 3
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.haproxy
    - vitabaks.autobase.keepalived
```

### Multi-Instance VRRP Configuration

```yaml
---
- hosts: balancers
  become: yes
  vars:
    # Primary VIP for database access
    cluster_vip: "10.0.1.100"
    vrrp_router_id: 51
    
    # Secondary VIP for management access
    cluster_vip_mgmt: "10.0.1.101" 
    vrrp_router_id_mgmt: 52
    
    # Priorities for primary instance
    keepalived_priority_master: "{{ 110 if inventory_hostname == groups['balancers'][0] else 100 }}"
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.haproxy
    - vitabaks.autobase.keepalived
```

### Development Environment Setup

```yaml
---
- hosts: balancers
  become: yes
  vars:
    cluster_vip: "192.168.100.100"
    vrrp_router_id: 100
    
    # Relaxed timings for development
    vrrp_advert_int: 3
    vrrp_preempt_delay: 15
    keepalived_check_interval: 5
    
    # Simple priority assignment
    keepalived_priority_master: "{{ 110 if inventory_hostname == groups['balancers'][0] else 105 }}"
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.haproxy
    - vitabaks.autobase.keepalived
```

### Full Stack PostgreSQL HA with Load Balancer HA

```yaml
---
# PostgreSQL cluster
- hosts: postgres_cluster
  become: yes
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.etcd
    - vitabaks.autobase.patroni

# High-availability load balancers
- hosts: balancers
  become: yes
  vars:
    # Load balancer HA configuration
    cluster_vip: "10.0.1.100"
    vrrp_router_id: 51
    keepalived_priority_master: "{{ 110 if inventory_hostname == groups['balancers'][0] else 100 }}"
    
    # HAProxy configuration
    with_haproxy_load_balancing: true
    haproxy_listen_port:
      master: 5000
      replicas: 5001
      stats: 7000
      
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.haproxy
    - vitabaks.autobase.keepalived
```

## VRRP Configuration Details

### Virtual Router Redundancy Protocol

VRRP allows multiple routers to participate in providing high availability for a virtual IP address:

```yaml
# VRRP Instance Configuration
vrrp_instance VI_1 {
    state {{ 'MASTER' if keepalived_priority_master > 100 else 'BACKUP' }}
    interface {{ vrrp_interface }}
    virtual_router_id {{ vrrp_router_id }}
    priority {{ keepalived_priority_master }}
    advert_int {{ vrrp_advert_int }}
    
    authentication {
        auth_type {{ vrrp_auth_type }}
        auth_pass {{ vrrp_auth_pass }}
    }
    
    virtual_ipaddress {
        {{ cluster_vip }}
    }
}
```

### Priority-Based Failover

- **Master Node**: Highest priority (typically 110+)
- **Backup Nodes**: Lower priority (100+)
- **Automatic Failover**: When master fails, highest-priority backup becomes master
- **Preemption**: Master reclaims VIP when it recovers (after preempt_delay)

## Health Check Integration

### HAProxy Health Check Script

The role creates a health check script that monitors HAProxy:

```bash
#!/bin/bash
# /usr/libexec/keepalived/haproxy_check.sh
/bin/kill -0 `cat /run/haproxy/haproxy.pid`
```

### Health Check Configuration

```yaml
vrrp_script haproxy_check {
    script "/usr/libexec/keepalived/haproxy_check.sh"
    interval {{ keepalived_check_interval }}    # Check every N seconds
    fall {{ keepalived_check_fall }}           # Failures to mark down
    rise {{ keepalived_check_rise }}           # Successes to mark up
}
```

### Track Script Integration

```yaml
track_script {
    haproxy_check
}
```

When HAProxy fails, keepalived automatically reduces the node's priority, triggering failover to a backup node.

## Network Requirements

### Multicast Support

VRRP uses multicast address 224.0.0.18 for advertisements:

```bash
# Ensure multicast is enabled
ip route show | grep 224.0.0.0
# Should show: 224.0.0.0/4 dev eth0 scope link
```

### Firewall Configuration

```bash
# Allow VRRP traffic
iptables -A INPUT -p vrrp -j ACCEPT
iptables -A INPUT -d 224.0.0.18/32 -j ACCEPT

# Or allow by protocol number
iptables -A INPUT -p 112 -j ACCEPT
```

### Switch Configuration

Ensure network switches support:
- VRRP multicast traffic
- MAC address changes for VIP
- No MAC address learning issues

## Operational Procedures

### Check VRRP Status

```bash
# Check keepalived service status
systemctl status keepalived

# View keepalived logs
journalctl -u keepalived -f

# Check VRRP state
ip addr show | grep -A 2 -B 2 "10.0.1.100"

# Monitor VRRP advertisements
tcpdump -i eth0 vrrp
```

### Manual Failover

```bash
# Force failover by stopping keepalived on master
systemctl stop keepalived

# Check new master
ip addr show | grep cluster_vip
```

### Health Check Testing

```bash
# Test health check script manually
/usr/libexec/keepalived/haproxy_check.sh
echo $?  # 0 = healthy, non-zero = unhealthy

# Simulate HAProxy failure
systemctl stop haproxy
# Watch keepalived logs for failover
```

## Configuration Templates

The role uses the template `keepalived.conf.j2` to generate `/etc/keepalived/keepalived.conf`:

```bash
# Main configuration sections
global_defs {
    router_id {{ inventory_hostname }}
    vrrp_skip_check_adv_addr
    vrrp_strict
    vrrp_garp_interval 0
    vrrp_gna_interval 0
}

vrrp_script haproxy_check {
    script "/usr/libexec/keepalived/haproxy_check.sh"
    interval 2
    fall 3
    rise 2
}

vrrp_instance VI_1 {
    # Configuration details...
}
```

## Monitoring and Troubleshooting

### VRRP State Monitoring

```bash
# Monitor VRRP state changes
journalctl -u keepalived -f | grep -i "state"

# Check current VIP ownership
ip addr show | grep "{{ cluster_vip }}"

# Verify VRRP advertisements
tcpdump -i {{ vrrp_interface }} host 224.0.0.18
```

### Common Issues and Solutions

1. **Split-brain scenarios**
   - Check network connectivity between keepalived nodes
   - Verify VRRP multicast traffic is flowing
   - Ensure consistent VRRP router IDs

2. **VIP not moving on failure**
   - Verify health check scripts are working
   - Check keepalived logs for script failures
   - Ensure priority differences are sufficient

3. **Frequent failover (flapping)**
   - Increase check intervals and thresholds
   - Stabilize underlying service health
   - Adjust preemption delays

### Debug Commands

```bash
# Check keepalived configuration
keepalived -t -f /etc/keepalived/keepalived.conf

# Monitor VRRP packets
tcpdump -i any vrrp -v

# Check virtual IP assignment
ip addr show | grep -E "(master|secondary)"

# View detailed keepalived status
systemctl status keepalived -l
```

## Integration with HAProxy

### Service Dependencies

```yaml
# Ensure HAProxy starts before keepalived
systemctl enable haproxy
systemctl enable keepalived

# Service ordering (if needed)
[Unit]
After=haproxy.service
```

### Load Balancer Health

Keepalived monitors HAProxy health and automatically fails over when:
- HAProxy process terminates
- HAProxy becomes unresponsive
- Custom health checks fail

## Security Considerations

### VRRP Authentication

```yaml
# Use authentication to prevent VRRP spoofing
authentication {
    auth_type PASS
    auth_pass "{{ vault_vrrp_password }}"  # Use Ansible Vault
}
```

### Network Isolation

- Run VRRP on dedicated management network when possible
- Use VLANs to isolate VRRP traffic
- Implement proper firewall rules for VRRP

### Access Control

- Limit keepalived configuration file access
- Monitor VRRP state changes
- Audit VIP assignments regularly

## Performance Tuning

### Advertisement Intervals

```yaml
# Fast failover (higher CPU usage)
vrrp_advert_int: 1
vrrp_preempt_delay: 5

# Stable operation (lower CPU usage)
vrrp_advert_int: 3
vrrp_preempt_delay: 15
```

### Health Check Frequency

```yaml
# Aggressive health checking
keepalived_check_interval: 1
keepalived_check_fall: 2
keepalived_check_rise: 2

# Conservative health checking
keepalived_check_interval: 5
keepalived_check_fall: 5
keepalived_check_rise: 3
```

## Handlers

- **restart keepalived**: Restart keepalived service after configuration changes

## Tags

Use these tags to run specific parts of the role:

- `keepalived`: Run all keepalived tasks
- `keepalived_install`: Install keepalived only
- `keepalived_conf`: Configure keepalived only

### Example with Tags

```bash
# Install keepalived only
ansible-playbook playbook.yml --tags keepalived_install

# Update configuration only
ansible-playbook playbook.yml --tags keepalived_conf
```

## Best Practices

### Design Considerations

- Use odd number of keepalived nodes when possible (3, 5)
- Plan IP address ranges carefully to avoid conflicts
- Document VIP assignments and VRRP router IDs
- Test failover scenarios regularly

### Operational Excellence

- Monitor VRRP state changes
- Set up alerts for failover events
- Document failover procedures
- Test backup and restore procedures

### Network Planning

- Coordinate with network team on VRRP configuration
- Ensure proper VLAN and routing setup
- Plan for network maintenance windows
- Consider geographic distribution for DR

## License

BSD

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
