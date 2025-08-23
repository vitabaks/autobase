# Ansible Role: firewall

This role configures iptables-based firewall rules for PostgreSQL cluster security. It provides a simple and effective way to control network access to PostgreSQL services and related components.

## Description

Network security is crucial for PostgreSQL deployments. This role creates and manages iptables firewall rules to:

- Control access to PostgreSQL ports
- Allow communication between cluster members
- Permit monitoring and administration access
- Block unauthorized network traffic
- Maintain SSH connectivity during firewall updates
- Support both IPv4 and IPv6 traffic
- Provide service management via systemd or init scripts

## Requirements

### Prerequisites

- iptables package must be available
- Root privileges for firewall configuration
- Network connectivity planning for cluster communication

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

### Firewall Service Configuration

```yaml
# Firewall service state
firewall_state: "started"              # started, stopped, restarted
firewall_enabled_at_boot: true         # Enable service at boot

# Firewall configuration
firewall_allowed_tcp_ports: []         # Additional TCP ports to allow
firewall_allowed_udp_ports: []         # Additional UDP ports to allow
firewall_additional_rules: []          # Custom iptables rules
```

### PostgreSQL-specific Configuration

```yaml
# PostgreSQL ports (from common role)
postgresql_port: 5432                  # PostgreSQL server port
pgbouncer_listen_port: 6432            # PgBouncer port (if used)

# HAProxy ports (if load balancing enabled)
haproxy_listen_port:
  master: 5000
  replicas: 5001
  stats: 7000

# etcd ports (for Patroni DCS)
etcd_client_port: 2379
etcd_peer_port: 2380
```

### Network Configuration

```yaml
# Network ranges for cluster access
cluster_network: "10.0.0.0/16"         # Internal cluster network
admin_network: "192.168.1.0/24"        # Administration network
monitoring_network: "172.16.0.0/16"    # Monitoring network
```

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Example Playbook

### Basic PostgreSQL Firewall

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    firewall_state: "started"
    firewall_enabled_at_boot: true
    
    # Allow PostgreSQL access from application network
    firewall_allowed_tcp_ports:
      - "5432"    # PostgreSQL
      - "22"      # SSH
      
  roles:
    - vitabaks.autobase.firewall
```

### Complete PostgreSQL Cluster Firewall

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    firewall_state: "started"
    firewall_enabled_at_boot: true
    
    # PostgreSQL cluster ports
    firewall_allowed_tcp_ports:
      - "22"      # SSH access
      - "5432"    # PostgreSQL
      - "6432"    # PgBouncer
      - "8008"    # Patroni REST API
      
    # Custom rules for cluster communication
    firewall_additional_rules:
      # Allow PostgreSQL traffic from cluster members
      - "iptables -A INPUT -p tcp --dport 5432 -s 10.0.1.0/24 -j ACCEPT"
      # Allow Patroni communication
      - "iptables -A INPUT -p tcp --dport 8008 -s 10.0.1.0/24 -j ACCEPT"
      # Allow etcd client traffic
      - "iptables -A INPUT -p tcp --dport 2379 -s 10.0.1.0/24 -j ACCEPT"
      # Allow etcd peer traffic
      - "iptables -A INPUT -p tcp --dport 2380 -s 10.0.1.10,10.0.1.11,10.0.1.12 -j ACCEPT"
      
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.firewall
```

### HAProxy Load Balancer Firewall

```yaml
---
- hosts: balancers
  become: yes
  vars:
    firewall_state: "started"
    firewall_enabled_at_boot: true
    
    # HAProxy and monitoring ports
    firewall_allowed_tcp_ports:
      - "22"      # SSH access
      - "5000"    # HAProxy master port
      - "5001"    # HAProxy replica port
      - "7000"    # HAProxy statistics
      
    # Network-specific access rules
    firewall_additional_rules:
      # Allow application access to database ports
      - "iptables -A INPUT -p tcp --dport 5000 -s 192.168.1.0/24 -j ACCEPT"
      - "iptables -A INPUT -p tcp --dport 5001 -s 192.168.1.0/24 -j ACCEPT"
      # Allow monitoring access
      - "iptables -A INPUT -p tcp --dport 7000 -s 172.16.0.100 -j ACCEPT"
      # Allow HAProxy health checks to PostgreSQL
      - "iptables -A OUTPUT -p tcp --dport 5432 -d 10.0.1.0/24 -j ACCEPT"
      
  roles:
    - vitabaks.autobase.common  
    - vitabaks.autobase.firewall
```

### Development Environment (Permissive)

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    firewall_state: "started"
    firewall_enabled_at_boot: true
    
    # More open rules for development
    firewall_allowed_tcp_ports:
      - "22"      # SSH
      - "5432"    # PostgreSQL
      - "6432"    # PgBouncer
      - "8008"    # Patroni REST API
      - "7000"    # HAProxy stats
      - "2379"    # etcd client
      - "9100"    # Node exporter
      - "9187"    # PostgreSQL exporter
      
    # Allow broader network access for development
    firewall_additional_rules:
      - "iptables -A INPUT -p tcp -s 10.0.0.0/8 -j ACCEPT"
      - "iptables -A INPUT -p tcp -s 192.168.0.0/16 -j ACCEPT"
      
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.firewall
```

### Production Environment with Strict Rules

```yaml
---
- hosts: postgres_cluster
  become: yes
  vars:
    firewall_state: "started"
    firewall_enabled_at_boot: true
    
    # Minimal open ports
    firewall_allowed_tcp_ports:
      - "22"      # SSH (consider changing default port)
      
    # Precise rules for production
    firewall_additional_rules:
      # SSH access from bastion host only
      - "iptables -A INPUT -p tcp --dport 22 -s 10.0.0.100 -j ACCEPT"
      
      # PostgreSQL access from application servers only
      - "iptables -A INPUT -p tcp --dport 5432 -s 10.0.2.0/24 -j ACCEPT"
      
      # PgBouncer access from application servers
      - "iptables -A INPUT -p tcp --dport 6432 -s 10.0.2.0/24 -j ACCEPT"
      
      # Cluster member communication
      - "iptables -A INPUT -p tcp --dport 5432 -s 10.0.1.10,10.0.1.11,10.0.1.12 -j ACCEPT"
      - "iptables -A INPUT -p tcp --dport 8008 -s 10.0.1.10,10.0.1.11,10.0.1.12 -j ACCEPT"
      
      # etcd cluster communication
      - "iptables -A INPUT -p tcp --dport 2379 -s 10.0.1.10,10.0.1.11,10.0.1.12 -j ACCEPT"
      - "iptables -A INPUT -p tcp --dport 2380 -s 10.0.1.10,10.0.1.11,10.0.1.12 -j ACCEPT"
      
      # Monitoring access from monitoring server
      - "iptables -A INPUT -p tcp --dport 9100 -s 10.0.3.100 -j ACCEPT"
      - "iptables -A INPUT -p tcp --dport 9187 -s 10.0.3.100 -j ACCEPT"
      
      # Block everything else
      - "iptables -A INPUT -j DROP"
      
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.firewall
```

## Firewall Rule Templates

### Basic Structure
The role generates a firewall script based on the template `firewall.bash.j2`:

```bash
#!/bin/bash
# Generated firewall rules
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X

# Allow loopback traffic
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Allow established connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Custom rules go here...
```

### Service Management
The role creates service files for both systemd and init systems:

- **systemd**: `/etc/systemd/system/firewall.service`
- **init**: `/etc/init.d/firewall`

## Common Port Configurations

### PostgreSQL Standard Ports
```yaml
firewall_allowed_tcp_ports:
  - "5432"    # PostgreSQL server
  - "6432"    # PgBouncer connection pooler
  - "8008"    # Patroni REST API
```

### etcd Ports
```yaml
firewall_allowed_tcp_ports:
  - "2379"    # etcd client communication
  - "2380"    # etcd peer communication
```

### HAProxy Ports
```yaml
firewall_allowed_tcp_ports:
  - "5000"    # Master database connections
  - "5001"    # Replica database connections
  - "7000"    # Statistics dashboard
```

### Monitoring Ports
```yaml
firewall_allowed_tcp_ports:
  - "9100"    # Node Exporter
  - "9187"    # PostgreSQL Exporter
  - "9113"    # Nginx Exporter (if applicable)
```

### Management Ports
```yaml
firewall_allowed_tcp_ports:
  - "22"      # SSH
  - "80"      # HTTP (for Let's Encrypt, etc.)
  - "443"     # HTTPS
```

## Advanced Firewall Rules

### Network Segmentation
```yaml
firewall_additional_rules:
  # Database tier - only accept connections from app tier
  - "iptables -A INPUT -p tcp --dport 5432 -s 10.0.2.0/24 -j ACCEPT"
  - "iptables -A INPUT -p tcp --dport 5432 -j DROP"
  
  # Application tier access
  - "iptables -A INPUT -p tcp --dport 6432 -s 10.0.2.0/24 -j ACCEPT"
  
  # Management access from admin network
  - "iptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT"
```

### Rate Limiting
```yaml
firewall_additional_rules:
  # Rate limit SSH connections
  - "iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set --name SSH"
  - "iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 --name SSH -j DROP"
  
  # Rate limit database connections
  - "iptables -A INPUT -p tcp --dport 5432 -m limit --limit 100/sec --limit-burst 200 -j ACCEPT"
```

### Logging
```yaml
firewall_additional_rules:
  # Log dropped packets
  - "iptables -A INPUT -m limit --limit 5/min -j LOG --log-prefix 'iptables denied: ' --log-level 7"
  - "iptables -A INPUT -j DROP"
```

## Connection Tracking

The role automatically configures connection tracking to prevent SSH disconnections during firewall updates:

```yaml
# Kernel modules loaded automatically
- nf_conntrack (or nf_conntrack_ipv4 for older kernels)

# Sysctl configuration
net.netfilter.nf_conntrack_tcp_be_liberal = 1
```

## Service Management

### systemd Systems
```bash
# Control firewall service
systemctl start firewall
systemctl stop firewall
systemctl restart firewall
systemctl status firewall

# Enable/disable at boot
systemctl enable firewall
systemctl disable firewall
```

### init Systems
```bash
# Control firewall service
service firewall start
service firewall stop
service firewall restart
service firewall status

# Enable/disable at boot
chkconfig firewall on
chkconfig firewall off
```

## Safety Features

### SSH Connection Protection
- Loads connection tracking modules before applying rules
- Configures liberal TCP connection handling
- Maintains established SSH connections

### Rule Validation
- Flushes existing rules before applying new ones
- Allows loopback traffic by default
- Permits established connections

### Service Integration
- Integrates with systemd or init systems
- Automatic startup at boot (if enabled)
- Proper service lifecycle management

## Testing Firewall Rules

### Before Deployment
```bash
# Test rules without applying
iptables-save > /tmp/current-rules.txt
# Apply new rules
iptables-restore < /etc/firewall.bash
# Test connectivity
# If issues, restore original rules
iptables-restore < /tmp/current-rules.txt
```

### After Deployment
```bash
# Check current rules
iptables -L -n -v

# Check specific port
nmap -p 5432 target-server

# Monitor connections
netstat -tulpn | grep :5432
ss -tulpn | grep :5432
```

## Integration with PostgreSQL Stack

### Patroni Integration
```yaml
firewall_additional_rules:
  # Allow Patroni cluster members to communicate
  - "iptables -A INPUT -p tcp --dport 8008 -s {{ groups['postgres_cluster'] | map('extract', hostvars, 'ansible_default_ipv4') | map(attribute='address') | join(',') }} -j ACCEPT"
```

### etcd Integration  
```yaml
firewall_additional_rules:
  # Allow etcd client access from PostgreSQL nodes
  - "iptables -A INPUT -p tcp --dport 2379 -s {{ groups['postgres_cluster'] | map('extract', hostvars, 'ansible_default_ipv4') | map(attribute='address') | join(',') }} -j ACCEPT"
  
  # Allow etcd peer communication between etcd nodes
  - "iptables -A INPUT -p tcp --dport 2380 -s {{ groups['etcd_cluster'] | map('extract', hostvars, 'ansible_default_ipv4') | map(attribute='address') | join(',') }} -j ACCEPT"
```

## Troubleshooting

### Common Issues

1. **SSH connection lost after firewall update**
   - Ensure SSH port is in `firewall_allowed_tcp_ports`
   - Check connection tracking module loading
   - Verify established connection rules

2. **Database connections failing**
   - Check PostgreSQL port in allowed ports
   - Verify source IP ranges in custom rules
   - Test with telnet or nc

3. **Cluster communication issues**
   - Verify all cluster member IPs in rules
   - Check both client and peer ports for etcd
   - Ensure Patroni REST API port is open

### Debug Commands
```bash
# Check current iptables rules
iptables -L -n -v

# Check connection tracking
cat /proc/sys/net/netfilter/nf_conntrack_tcp_be_liberal

# Test port connectivity
nc -zv target-ip 5432
nmap -p 5432 target-ip

# Monitor firewall logs
tail -f /var/log/messages | grep "iptables denied"
journalctl -f | grep "iptables denied"
```

## Handlers

- **restart firewall**: Restart firewall service with new rules

## Tags

Use these tags to run specific parts of the role:

- `firewall`: Configure and manage firewall rules

### Example with Tags

```bash
# Configure firewall only
ansible-playbook playbook.yml --tags firewall
```

## Security Best Practices

### Rule Design
- Use specific IP ranges instead of 0.0.0.0/0
- Implement least privilege access
- Regularly audit firewall rules
- Document rule purposes

### Network Segmentation
- Separate database, application, and management networks
- Use different subnets for different tiers
- Implement DMZ for external-facing services

### Monitoring
- Enable firewall logging
- Monitor dropped connections
- Alert on unusual traffic patterns
- Regular rule effectiveness review

### Maintenance
- Keep rules updated with infrastructure changes
- Test rules in staging before production
- Have rollback procedures ready
- Document all custom rules

## License

MIT

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
