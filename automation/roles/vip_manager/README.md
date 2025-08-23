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

## Example Playbook

### Basic VIP Manager Setup

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    cluster_vip: "10.0.1.100"
    vip_manager_iface: "eth0"
    dcs_type: "etcd"
    dcs_endpoint: "http://etcd-01:2379,http://etcd-02:2379,http://etcd-03:2379"
    
  roles:
    - vitabaks.autobase.vip_manager
```

### Production PostgreSQL Cluster with VIP

```yaml
---
# etcd cluster for Patroni DCS
- hosts: etcd_cluster
  become: yes
  roles:
    - vitabaks.autobase.etcd

# PostgreSQL cluster with VIP management
- hosts: postgres_cluster
  become: yes
  vars:
    patroni_cluster_name: "postgres-prod"
    
    # VIP configuration
    cluster_vip: "192.168.1.100"
    vip_manager_iface: "bond0"
    vip_manager_mask: 24
    
    # DCS configuration
    dcs_type: "etcd"
    dcs_endpoint: "{{ groups['etcd_cluster'] | map('extract', hostvars, 'ansible_default_ipv4') | map(attribute='address') | map('regex_replace', '^(.*)$', 'http://\\1:2379') | join(',') }}"
    
    # Enhanced logging for production
    vip_manager_verbose: true
    vip_manager_log_level: "DEBUG"
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.patroni
    - vitabaks.autobase.vip_manager
```

### Multi-Network Setup

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    # Primary VIP for application access
    cluster_vip: "10.0.1.100"
    vip_manager_iface: "eth0"
    
    # Management network VIP (optional)
    cluster_vip_mgmt: "192.168.1.100"
    vip_manager_iface_mgmt: "eth1"
    
    # DCS configuration
    dcs_type: "etcd"
    dcs_endpoint: "http://10.0.3.10:2379,http://10.0.3.11:2379,http://10.0.3.12:2379"
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.patroni  
    - vitabaks.autobase.vip_manager
```

### Consul DCS Integration

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    cluster_vip: "10.0.1.100"
    
    # Consul DCS configuration
    dcs_type: "consul"
    dcs_endpoint: "http://consul-01:8500,http://consul-02:8500,http://consul-03:8500"
    
    # Custom vip-manager configuration
    vip_manager_key: "/service/{{ patroni_cluster_name }}/leader"
    vip_manager_conf: "/etc/vip-manager.yml"
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.consul
    - vitabaks.autobase.patroni
    - vitabaks.autobase.vip_manager
```

### Development Environment

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    cluster_vip: "192.168.100.100"
    vip_manager_iface: "eth0"
    
    # Simple etcd setup
    dcs_type: "etcd"
    dcs_endpoint: "http://localhost:2379"  # Single-node etcd for dev
    
    # Debug logging
    vip_manager_verbose: true
    vip_manager_log_level: "DEBUG"
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.etcd
    - vitabaks.autobase.patroni
    - vitabaks.autobase.vip_manager
```

## How vip-manager Works

### Automatic VIP Assignment

vip-manager continuously monitors the DCS for leadership changes:

1. **Monitor DCS**: Watches the Patroni leader key in etcd/Consul
2. **Detect Changes**: Identifies when a new primary is elected
3. **VIP Movement**: Assigns VIP to the current PostgreSQL primary
4. **Network Update**: Updates local network interface and routing

### Leadership Detection

```yaml
# vip-manager monitors this key for changes
vip_manager_key: "/service/postgres-cluster/leader"

# When Patroni updates leadership:
# OLD: {"leader": "postgres-01", "conn_url": "postgres://..."}  
# NEW: {"leader": "postgres-02", "conn_url": "postgres://..."}
```

### VIP Assignment Logic

```yaml
# If current node is the leader
if (current_node == patroni_leader):
    assign_vip_to_interface()
else:
    remove_vip_from_interface()
```

## Configuration Templates

### vip-manager.yml Configuration

The role uses `vip-manager.yml.j2` to generate the main configuration:

```yaml
# /etc/vip-manager.yml
dcs: "{{ dcs_type }}"
dcs_endpoints:
  - "{{ dcs_endpoint }}"

key: "{{ vip_manager_key }}"
nodename: "{{ ansible_hostname }}"

ip: "{{ cluster_vip }}"
mask: {{ vip_manager_mask }}
iface: {{ vip_manager_iface }}

verbose: {{ vip_manager_verbose | lower }}
```

### Systemd Service

The role creates a systemd service file `vip-manager.service`:

```ini
[Unit]
Description=Manages a virtual IP for PostgreSQL
After=network.target

[Service]
Type=simple
User={{ vip_manager_user }}
Group={{ vip_manager_group }}
ExecStart=/usr/bin/vip-manager
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

## Integration with Patroni

### Seamless Failover

When Patroni promotes a new primary:

1. **Patroni**: Updates leader key in DCS
2. **vip-manager**: Detects leadership change
3. **Network**: VIP moves to new primary server
4. **Applications**: Reconnect to same VIP transparently

### Configuration Coordination

```yaml
# Patroni configuration includes VIP key
patroni:
  bootstrap:
    dcs:
      leader_key: "/service/postgres-cluster/leader"
      
# vip-manager monitors the same key
vip_manager_key: "/service/postgres-cluster/leader"
```

## Operational Procedures

### Check vip-manager Status

```bash
# Service status
systemctl status vip-manager

# View logs
journalctl -u vip-manager -f

# Check VIP assignment
ip addr show | grep "{{ cluster_vip }}"

# Test VIP connectivity
ping {{ cluster_vip }}
```

### Manual VIP Management

```bash
# Stop vip-manager (removes VIP)
systemctl stop vip-manager

# Start vip-manager (assigns VIP if node is primary)
systemctl start vip-manager

# Reload configuration
systemctl reload vip-manager
```

### Failover Testing

```bash
# Simulate primary failure
systemctl stop patroni

# Watch VIP movement
watch -n 1 'ip addr show | grep -A 2 -B 2 "{{ cluster_vip }}"'

# Monitor vip-manager logs during failover
journalctl -u vip-manager -f
```

## Monitoring and Alerting

### Health Checks

```bash
# Check if VIP is assigned to the right node
vip_assigned=$(ip addr show | grep -c "{{ cluster_vip }}")
patroni_primary=$(patronictl -c /etc/patroni/patroni.yml list --format json | jq -r '.[] | select(.Role=="Leader") | .Member')

if [[ $vip_assigned -eq 1 && "$(hostname)" == "$patroni_primary" ]]; then
  echo "VIP correctly assigned to primary"
else
  echo "VIP assignment issue detected"
fi
```

### Metrics Collection

```bash
# VIP assignment metrics
vip_assigned=$(ip addr show | grep -c "{{ cluster_vip }}")
echo "vip_assigned ${vip_assigned}"

# Service status metrics
vip_manager_active=$(systemctl is-active vip-manager)
echo "vip_manager_active $([ "$vip_manager_active" == "active" ] && echo 1 || echo 0)"
```

### Log Analysis

```bash
# Monitor VIP changes
journalctl -u vip-manager | grep -E "(Acquiring|Releasing) VIP"

# Check for errors
journalctl -u vip-manager | grep -i error

# Monitor DCS connection issues
journalctl -u vip-manager | grep -i "connection failed"
```

## Troubleshooting

### Common Issues

1. **VIP not assigned after failover**
   - Check vip-manager service status
   - Verify DCS connectivity
   - Confirm leadership information in DCS

2. **Multiple nodes with same VIP**
   - Check for split-brain scenario
   - Verify DCS cluster health
   - Review vip-manager logs for conflicts

3. **Applications can't connect to VIP**
   - Verify VIP is assigned to correct interface
   - Check network routing and ARP tables
   - Confirm firewall rules allow VIP traffic

### Debug Commands

```bash
# Test DCS connectivity
curl -s "{{ dcs_endpoint }}/v2/keys/service/{{ patroni_cluster_name }}/leader"

# Check network configuration
ip addr show {{ vip_manager_iface }}
ip route show | grep {{ cluster_vip }}

# Monitor ARP table
arp -a | grep "{{ cluster_vip }}"

# Test VIP connectivity
telnet {{ cluster_vip }} 5432
```

### Recovery Procedures

```bash
# Reset VIP assignment
systemctl stop vip-manager
ip addr del {{ cluster_vip }}/{{ vip_manager_mask }} dev {{ vip_manager_iface }}
systemctl start vip-manager

# Clear ARP cache (on client systems)
arp -d {{ cluster_vip }}

# Force configuration reload
systemctl reload vip-manager
```

## Comparison with Keepalived

### vip-manager Advantages

- **PostgreSQL-aware**: Directly integrates with Patroni
- **Simpler setup**: No VRRP complexity
- **Lighter weight**: Minimal resource usage
- **DCS integration**: Uses same DCS as Patroni

### keepalived Advantages

- **VRRP standard**: Industry standard protocol
- **Independent**: Works without external DCS
- **Load balancer focus**: Better for HAProxy HA
- **Mature**: Longer track record

### Use Case Recommendations

```yaml
# Use vip-manager for:
# - Direct PostgreSQL VIP management
# - Simple single-VIP scenarios
# - Patroni-integrated environments

# Use keepalived for:
# - Load balancer high availability
# - Complex multi-VIP scenarios
# - Network infrastructure integration
```

## Network Considerations

### ARP Behavior

When VIP moves between nodes:
- vip-manager sends gratuitous ARP
- Network switches update MAC tables
- Clients receive ARP updates

### Network Switch Requirements

- Support for gratuitous ARP
- Fast MAC address learning
- Proper VLAN configuration if used

### Firewall Integration

```bash
# Allow VIP traffic on assigned interface
iptables -A INPUT -d {{ cluster_vip }} -j ACCEPT
iptables -A OUTPUT -s {{ cluster_vip }} -j ACCEPT
```

## Performance and Scalability

### Resource Usage

vip-manager is lightweight:
- Minimal CPU usage (polling-based)
- Low memory footprint (<10MB)
- No network protocol overhead (unlike VRRP)

### Scaling Considerations

- Single VIP per cluster (design limitation)
- Scales with number of PostgreSQL nodes
- DCS performance affects failover speed

## Security Considerations

### DCS Security

```yaml
# Use TLS for DCS communication when possible
dcs_endpoints:
  - "https://etcd-01:2379"
  - "https://etcd-02:2379"
  - "https://etcd-03:2379"
```

### Service Permissions

- Run as postgres user (limited privileges)
- Requires network interface modification rights
- No root privileges needed after installation

### Network Security

- Secure DCS communication channels  
- Monitor VIP assignment changes
- Implement proper firewall rules

## Handlers

- **restart vip-manager**: Restart vip-manager service after configuration changes

## Tags

Use these tags to run specific parts of the role:

- `vip`: Run all VIP management tasks
- `vip_manager`: Run all vip-manager tasks  
- `vip_manager_conf`: Configure vip-manager only
- `vip_manager_service`: Manage vip-manager service only

### Example with Tags

```bash
# Install and configure vip-manager
ansible-playbook playbook.yml --tags vip_manager

# Update configuration only
ansible-playbook playbook.yml --tags vip_manager_conf
```

## Best Practices

### Design Principles

- Use single VIP per PostgreSQL cluster
- Ensure proper network infrastructure support
- Monitor VIP assignment continuously
- Test failover scenarios regularly

### Configuration Management

- Keep vip-manager configuration synchronized
- Use consistent DCS endpoints across cluster
- Document VIP assignments and network topology
- Version control configuration files

### Operational Excellence  

- Monitor DCS connectivity health
- Set up alerts for VIP movement
- Practice failover procedures
- Maintain network documentation

### Integration Planning

- Coordinate with network team on VIP ranges
- Plan maintenance windows for network changes
- Consider application connection pooling
- Document client connection procedures

## License

MIT

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
