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
