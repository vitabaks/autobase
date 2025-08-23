# Ansible Role: etcd

This role installs and configures [etcd](https://etcd.io/), a distributed, reliable key-value store used as the backend for service discovery and cluster coordination. In the context of PostgreSQL clusters, etcd serves as the Distributed Configuration Store (DCS) for Patroni.

## Description

etcd is a strongly consistent, distributed key-value store that provides a reliable way to store data that needs to be accessed by a distributed system or cluster of machines. This role:

- Installs etcd from official releases or system packages
- Configures etcd cluster members and networking
- Sets up TLS security for etcd communication  
- Manages etcd systemd services
- Provides cluster initialization and bootstrapping
- Integrates with Patroni for PostgreSQL high availability

## Requirements

### Prerequisites

- Network connectivity between etcd cluster members
- Sufficient disk space and IOPS for etcd data
- Proper time synchronization between cluster members
- Open firewall ports for etcd communication

### Operating System Support

- **Debian/Ubuntu**: 18.04, 20.04, 22.04, 24.04
- **RHEL/CentOS/Rocky/AlmaLinux**: 8, 9
- **Amazon Linux**: 2023

## Role Variables

This role uses variables defined in the `vitabaks.autobase.common` role.

### Cluster Configuration

```yaml
# etcd cluster settings
etcd_cluster_name: "etcd-cluster"
etcd_bind_address: "{{ ansible_default_ipv4.address }}"

# etcd data directory
etcd_data_dir: "/var/lib/etcd"

# etcd member configuration
etcd_client_port: 2379
etcd_peer_port: 2380
```

### Installation Configuration

```yaml
# Installation method
etcd_installation_method: "package"    # or "binary"

# Package repository URL (for binary installation)
etcd_package_repo: "https://github.com/etcd-io/etcd/releases/download/v{{ etcd_version }}/etcd-v{{ etcd_version }}-linux-amd64.tar.gz"

# etcd version
etcd_version: "3.5.10"
```

### Network and Security

```yaml
# Client URLs
etcd_listen_client_urls: "http://{{ etcd_bind_address }}:{{ etcd_client_port }},http://localhost:{{ etcd_client_port }}"
etcd_advertise_client_urls: "http://{{ etcd_bind_address }}:{{ etcd_client_port }}"

# Peer URLs  
etcd_listen_peer_urls: "http://{{ etcd_bind_address }}:{{ etcd_peer_port }}"
etcd_initial_advertise_peer_urls: "http://{{ etcd_bind_address }}:{{ etcd_peer_port }}"

# TLS Configuration (optional)
etcd_enable_tls: false
etcd_cert_file: ""
etcd_key_file: ""
etcd_ca_file: ""
```

### Performance Tuning

```yaml
# Snapshot and WAL settings
etcd_snapshot_count: 100000
etcd_max_snapshots: 5
etcd_max_wals: 5

# Heartbeat and election timeouts
etcd_heartbeat_interval: 100          # milliseconds
etcd_election_timeout: 1000           # milliseconds

# Request timeout
etcd_request_timeout: 10              # seconds
```

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Example Playbook

### Basic 3-Node etcd Cluster

```yaml
---
- hosts: etcd_cluster
  become: yes
  vars:
    etcd_cluster_name: "postgres-etcd"
    etcd_client_port: 2379
    etcd_peer_port: 2380
    
  roles:
    - vitabaks.autobase.etcd
```

### Production etcd Cluster with Performance Tuning

```yaml
---
- hosts: etcd_cluster
  become: yes
  vars:
    etcd_cluster_name: "production-etcd"
    
    # Performance optimization
    etcd_snapshot_count: 50000
    etcd_max_snapshots: 10
    etcd_max_wals: 10
    etcd_heartbeat_interval: 100
    etcd_election_timeout: 5000        # Higher for network latency
    
    # Data directory on fast storage
    etcd_data_dir: "/fast-storage/etcd"
    
    # Network binding
    etcd_bind_address: "{{ ansible_default_ipv4.address }}"
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.etcd
```

### Secure etcd Cluster with TLS

```yaml
---
- hosts: etcd_cluster
  become: yes
  vars:
    etcd_cluster_name: "secure-etcd"
    
    # TLS security
    etcd_enable_tls: true
    etcd_cert_file: "/etc/etcd/etcd-server.crt"
    etcd_key_file: "/etc/etcd/etcd-server.key"
    etcd_ca_file: "/etc/etcd/ca.crt"
    
    # Secure client URLs
    etcd_listen_client_urls: "https://{{ etcd_bind_address }}:{{ etcd_client_port }},https://localhost:{{ etcd_client_port }}"
    etcd_advertise_client_urls: "https://{{ etcd_bind_address }}:{{ etcd_client_port }}"
    etcd_listen_peer_urls: "https://{{ etcd_bind_address }}:{{ etcd_peer_port }}"
    etcd_initial_advertise_peer_urls: "https://{{ etcd_bind_address }}:{{ etcd_peer_port }}"
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.tls_certificate    # Generate certificates first
    - vitabaks.autobase.etcd
```

### Full Stack with PostgreSQL and Patroni

```yaml
---
# etcd cluster for Patroni DCS
- hosts: etcd_cluster
  become: yes
  vars:
    etcd_cluster_name: "postgres-dcs"
    etcd_data_dir: "/var/lib/etcd"
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.etcd

# PostgreSQL cluster with Patroni using etcd
- hosts: postgres_cluster
  become: yes
  vars:
    patroni_cluster_name: "postgres-cluster"
    dcs_type: "etcd"
    dcs_endpoint: "{{ groups['etcd_cluster'] | map('extract', hostvars, 'ansible_default_ipv4') | map(attribute='address') | map('regex_replace', '^(.*)$', 'http://\\1:2379') | list | join(',') }}"
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.patroni
```

## Cluster Initialization

### Single-Node Bootstrap
```yaml
# For development/testing only
etcd_initial_cluster_state: "new"
etcd_initial_cluster_token: "etcd-cluster-1"
```

### Multi-Node Cluster
The role automatically configures multi-node clusters based on inventory:

```ini
[etcd_cluster]
etcd-01 ansible_host=10.0.1.10
etcd-02 ansible_host=10.0.1.11  
etcd-03 ansible_host=10.0.1.12
```

## Network Configuration

### Firewall Ports
Ensure these ports are open between etcd members:
- **2379**: Client communication
- **2380**: Peer communication

### Example Firewall Rules
```bash
# Client port (for Patroni connections)
iptables -A INPUT -p tcp --dport 2379 -s 10.0.0.0/16 -j ACCEPT

# Peer port (for etcd cluster communication)
iptables -A INPUT -p tcp --dport 2380 -s 10.0.1.10,10.0.1.11,10.0.1.12 -j ACCEPT
```

## Operations and Maintenance

### Cluster Health Check
```bash
# Check cluster health
etcdctl endpoint health --endpoints=http://etcd-01:2379,http://etcd-02:2379,http://etcd-03:2379

# Check cluster status
etcdctl endpoint status --write-out=table --endpoints=http://etcd-01:2379,http://etcd-02:2379,http://etcd-03:2379

# List cluster members
etcdctl member list --endpoints=http://etcd-01:2379
```

### Backup and Recovery
```bash
# Create snapshot backup
etcdctl snapshot save /backup/etcd-$(date +%Y%m%d-%H%M%S).db --endpoints=http://etcd-01:2379

# Restore from snapshot
etcdctl snapshot restore /backup/etcd-20231215-083000.db \
  --name etcd-01 \
  --initial-cluster etcd-01=http://10.0.1.10:2380,etcd-02=http://10.0.1.11:2380,etcd-03=http://10.0.1.12:2380 \
  --initial-advertise-peer-urls http://10.0.1.10:2380
```

### Member Management
```bash
# Add new member
etcdctl member add etcd-04 --peer-urls=http://10.0.1.13:2380

# Remove member
etcdctl member remove <member-id>

# Update member peer URLs
etcdctl member update <member-id> --peer-urls=http://10.0.1.10:2380
```

## Performance Tuning

### Storage Considerations
- Use SSDs for etcd data directory
- Ensure low-latency storage (< 10ms)
- Separate etcd data from OS disk if possible

### Network Optimization
```yaml
# Adjust timeouts for network conditions
etcd_heartbeat_interval: 100          # Lower for low-latency networks
etcd_election_timeout: 1000           # Higher for high-latency networks
etcd_request_timeout: 5               # Adjust based on workload
```

### Memory and CPU
- Minimum 2GB RAM for production
- 2-4 CPU cores recommended
- Consider NUMA topology for large deployments

## Monitoring

### Key Metrics to Monitor
- **Leader changes**: Frequent changes indicate network issues
- **Proposal failures**: Failed consensus proposals
- **Disk sync duration**: Storage performance indicator
- **Network latency**: Between cluster members
- **Database size**: etcd data growth over time

### Health Checks
```bash
# Script for monitoring
#!/bin/bash
ENDPOINTS="http://etcd-01:2379,http://etcd-02:2379,http://etcd-03:2379"

# Check if etcd is responding
if etcdctl endpoint health --endpoints=$ENDPOINTS > /dev/null 2>&1; then
  echo "etcd cluster is healthy"
  exit 0
else
  echo "etcd cluster has issues"
  exit 1
fi
```

## Security Best Practices

### Authentication
```yaml
# Enable authentication (requires manual setup)
etcd_enable_auth: false    # Set to true after initial setup
```

### Network Security
- Use TLS for production deployments
- Restrict network access to etcd ports
- Use firewall rules to limit client connections
- Consider VPN or private networks for multi-datacenter

### Data Security
- Encrypt etcd data at rest
- Regular backup of etcd data
- Secure backup storage location
- Test restore procedures regularly

## Troubleshooting

### Common Issues

1. **Split-brain scenarios**
   - Ensure odd number of cluster members (3, 5, 7)
   - Monitor network connectivity between members
   - Check election timeout settings

2. **Performance degradation**
   - Monitor disk I/O and latency
   - Check network latency between members
   - Review etcd metrics and logs

3. **Member failure recovery**
   - Replace failed members promptly
   - Ensure proper cleanup of old member data
   - Verify cluster health after member replacement

### Log Analysis
```bash
# Check etcd logs
journalctl -u etcd -f

# Look for specific error patterns
journalctl -u etcd | grep -E "(ERROR|WARN|failed)"

# Check disk sync duration
journalctl -u etcd | grep "sync duration"
```

## Integration with Patroni

etcd serves as the DCS (Distributed Configuration Store) for Patroni:

```yaml
# Patroni configuration snippet
dcs:
  type: etcd
  endpoints:
    - http://etcd-01:2379
    - http://etcd-02:2379
    - http://etcd-03:2379
  namespace: /service/{{ patroni_cluster_name }}
```

## Tags

Use these tags to run specific parts of the role:

- `etcd`: Run all etcd tasks
- `etcd_install`: Install etcd only

### Example with Tags

```bash
# Install etcd only
ansible-playbook playbook.yml --tags etcd_install

# Configure etcd only
ansible-playbook playbook.yml --tags etcd
```

## Best Practices

### Cluster Sizing
- Use 3 members for basic HA
- Use 5 members for higher availability
- Avoid even numbers of members
- Consider geographical distribution for disaster recovery

### Capacity Planning
- Plan for 3-5x growth in key-value pairs
- Monitor database size growth
- Set up alerts for storage utilization
- Regular compaction and defragmentation

### Maintenance
- Regular backups of etcd data
- Monitor cluster health continuously
- Plan maintenance windows for updates
- Test failure scenarios regularly

## License

BSD

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
