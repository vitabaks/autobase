# Ansible Role: haproxy

This role installs and configures [HAProxy](http://www.haproxy.org/), a reliable, high-performance TCP/HTTP load balancer. In the context of PostgreSQL clusters, HAProxy provides load balancing and high availability for database connections.

## Description

HAProxy is a free, fast, and reliable solution offering high availability, load balancing, and proxying for TCP and HTTP-based applications. This role:

- Installs HAProxy from system packages
- Configures load balancing for PostgreSQL master and replica servers
- Sets up health checks for automatic failover
- Provides statistics dashboard for monitoring
- Integrates with Patroni-managed PostgreSQL clusters
- Supports custom backend configurations
- Manages systemd services for HAProxy lifecycle

## Requirements

### Prerequisites

- Target PostgreSQL servers must be accessible
- Network connectivity between HAProxy and PostgreSQL servers
- Proper firewall configuration for HAProxy ports

### Operating System Support

- **Debian/Ubuntu**: 18.04, 20.04, 22.04, 24.04
- **RHEL/CentOS/Rocky/AlmaLinux**: 8, 9
- **Amazon Linux**: 2023

## Role Variables

This role uses variables defined in the `vitabaks.autobase.common` role.

### Load Balancer Configuration

```yaml
# HAProxy listening ports (from common role)
haproxy_listen_port:
  master: 5000              # Primary database connections
  replicas: 5001            # Read-only replica connections  
  replicas_sync: 5002       # Synchronous replica connections
  replicas_async: 5003      # Asynchronous replica connections
  stats: 7000               # Statistics dashboard
  
# Optional direct connection ports (bypassing PgBouncer)
haproxy_listen_port:
  master_direct: 6000       # Direct primary connections
  replicas_direct: 6001     # Direct replica connections
  replicas_sync_direct: 6002
  replicas_async_direct: 6003
```

### Connection Limits

```yaml
# Maximum concurrent connections (from common role)
haproxy_maxconn:
  global: 100000            # Global HAProxy connection limit
  master: 10000             # Per-master backend limit
  replica: 10000            # Per-replica backend limit
```

### Timeout Configuration

```yaml
# Connection timeouts (from common role)
haproxy_timeout:
  client: "60m"             # Client connection timeout
  server: "60m"             # Server connection timeout
  connect: "10s"            # Connection establishment timeout
  check: "10s"              # Health check timeout
```

### Bind Configuration

```yaml
# HAProxy bind address
haproxy_bind_address: "*"               # Listen on all interfaces
bind_address: "{{ ansible_default_ipv4.address }}"  # Default bind address
```

### Statistics Configuration

```yaml
# HAProxy statistics dashboard
haproxy_stats_enabled: true
haproxy_stats_user: "admin"
haproxy_stats_password: "admin"         # Change this in production!
haproxy_stats_uri: "/stats"
```

### PostgreSQL Integration

```yaml
# Cluster configuration (from common role)
patroni_cluster_name: "postgres-cluster"
with_haproxy_load_balancing: true       # Enable HAProxy integration

# Health check settings
haproxy_check_port: "{{ postgresql_port }}"    # Usually 5432
haproxy_check_inter: "2s"               # Health check interval
haproxy_check_rise: 2                   # Checks before marking server up
haproxy_check_fall: 3                   # Checks before marking server down
```

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Example Playbook

### Basic PostgreSQL Load Balancing

```yaml
---
- hosts: balancers
  become: yes
  vars:
    with_haproxy_load_balancing: true
    haproxy_listen_port:
      master: 5000
      replicas: 5001
      stats: 7000
    haproxy_stats_password: "MySecureStatsPassword123"
  roles:
    - vitabaks.autobase.haproxy
```

### High-Performance Configuration

```yaml
---
- hosts: balancers
  become: yes
  vars:
    # High-capacity settings
    haproxy_maxconn:
      global: 500000
      master: 50000
      replica: 50000
      
    # Optimized timeouts
    haproxy_timeout:
      client: "30m"
      server: "30m" 
      connect: "5s"
      check: "5s"
      
    # Multiple service ports
    haproxy_listen_port:
      master: 5000
      replicas: 5001
      replicas_sync: 5002
      replicas_async: 5003
      master_direct: 6000    # Direct PostgreSQL connections
      replicas_direct: 6001
      stats: 7000
      
    # Enhanced health checks
    haproxy_check_inter: "1s"
    haproxy_check_rise: 3
    haproxy_check_fall: 2
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.haproxy
```

### Development Environment

```yaml
---
- hosts: balancers
  become: yes
  vars:
    # Relaxed settings for development
    haproxy_maxconn:
      global: 10000
      master: 1000
      replica: 1000
      
    haproxy_timeout:
      client: "2h"    # Long timeouts for debugging
      server: "2h"
      
    # Development-friendly stats access
    haproxy_stats_user: "dev"
    haproxy_stats_password: "development"
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.haproxy
```

### Full Stack Deployment

```yaml
---
# PostgreSQL cluster hosts
- hosts: postgres_cluster
  become: yes
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.patroni
    
# HAProxy load balancers
- hosts: balancers
  become: yes
  vars:
    with_haproxy_load_balancing: true
    
    # Load balancer configuration
    haproxy_listen_port:
      master: 5000
      replicas: 5001
      stats: 7000
      
    haproxy_maxconn:
      global: 100000
      master: 10000
      replica: 10000
      
    # Security settings
    haproxy_stats_user: "admin"
    haproxy_stats_password: "{{ vault_haproxy_stats_password }}"
    
  roles:
    - vitabaks.autobase.common
    - vitabaks.autobase.haproxy
```

## Load Balancing Strategies

### Master-Replica Configuration

HAProxy automatically routes connections based on PostgreSQL server roles:

- **Master Port (5000)**: Routes to primary PostgreSQL server
- **Replica Port (5001)**: Load balances across read-only replicas
- **Sync Replica Port (5002)**: Routes to synchronous replicas only
- **Async Replica Port (5003)**: Routes to asynchronous replicas only

### Health Check Configuration

HAProxy performs health checks to ensure only healthy servers receive traffic:

```yaml
# Health check settings
haproxy_check_inter: "2s"     # Check every 2 seconds
haproxy_check_rise: 2         # 2 successful checks = server is up
haproxy_check_fall: 3         # 3 failed checks = server is down
haproxy_check_timeout: "10s"  # Check timeout
```

### Failover Behavior

When the primary server fails:
1. HAProxy detects failure via health checks
2. New primary is elected by Patroni
3. HAProxy automatically routes traffic to new primary
4. No manual intervention required

## Monitoring and Statistics

### Statistics Dashboard

Access HAProxy statistics at: `http://your-haproxy-server:7000/stats`

Default credentials (change in production):
- Username: `admin`  
- Password: `admin`

### Key Metrics to Monitor

- **Session Rate**: Current connections per second
- **Queue Length**: Queued requests waiting for servers
- **Response Time**: Average server response times
- **Error Rate**: Connection failures and timeouts
- **Server Status**: Up/down status of backend servers

### Log Configuration

HAProxy logs can be configured for detailed connection tracking:

```yaml
# Enable detailed logging
haproxy_log_format: |
  {
    "pid": %pid,
    "frontend_name": "%f",
    "backend_name": "%b", 
    "server_name": "%s",
    "time_request": "%Tr",
    "time_connect": "%Tc",
    "response_time": "%Ta"
  }
```

## Configuration Templates

This role provides the following templates:

- **haproxy.cfg.j2**: Main HAProxy configuration file
- **haproxy.service.j2**: Systemd service definition for HAProxy

## Integration with PgBouncer

When used with PgBouncer for connection pooling:

```yaml
# HAProxy routes to PgBouncer instances
haproxy_listen_port:
  master: 5000        # Routes to PgBouncer (port 6432)
  replicas: 5001      # Routes to replica PgBouncer instances

# Direct PostgreSQL access (optional)
haproxy_listen_port:
  master_direct: 6000   # Bypasses PgBouncer, connects to PostgreSQL directly
  replicas_direct: 6001
```

## Advanced Configuration

### SSL/TLS Termination

```yaml
# Enable SSL termination (requires certificates)
haproxy_ssl_enabled: true
haproxy_ssl_certificate_path: "/etc/ssl/certs/haproxy.pem"
haproxy_ssl_redirect: true    # Redirect HTTP to HTTPS
```

### Custom Backend Configuration

```yaml
# Add custom backends
haproxy_custom_backends:
  - name: "custom_app"
    port: 8080
    servers:
      - "app1.example.com:8080 check"
      - "app2.example.com:8080 check"
```

### Rate Limiting

```yaml
# Connection rate limiting
haproxy_rate_limit:
  stick_table_size: "100k"
  rate_limit_sessions: 100
  rate_limit_period: "10s"
```

## Handlers

- **restart haproxy**: Restart HAProxy service and verify connectivity

## Tags

Use these tags to run specific parts of the role:

- `haproxy`: Run all HAProxy tasks
- `load_balancing`: Same as haproxy (alias)
- `haproxy_conf`: Configure HAProxy only
- `haproxy_service`: Manage HAProxy service only

### Example with Tags

```bash
# Install and configure HAProxy
ansible-playbook playbook.yml --tags haproxy

# Update configuration only
ansible-playbook playbook.yml --tags haproxy_conf
```

## Inventory Configuration

### Simple Setup

```ini
[balancers]
haproxy-01 ansible_host=10.0.1.100

[postgres_cluster] 
pg-master  ansible_host=10.0.1.10
pg-replica1 ansible_host=10.0.1.11
pg-replica2 ansible_host=10.0.1.12
```

### High-Availability Setup

```ini
[balancers]
haproxy-01 ansible_host=10.0.1.100
haproxy-02 ansible_host=10.0.1.101

[postgres_cluster]
pg-master  ansible_host=10.0.1.10
pg-replica1 ansible_host=10.0.1.11 
pg-replica2 ansible_host=10.0.1.12
```

## Troubleshooting

### Connection Issues

1. **Check HAProxy status**: `systemctl status haproxy`
2. **Verify port accessibility**: `netstat -tlnp | grep haproxy`
3. **Review HAProxy logs**: `journalctl -u haproxy -f`
4. **Check backend health**: Visit statistics dashboard

### Performance Issues

1. **Monitor connection limits**: Check if `haproxy_maxconn` limits are reached
2. **Optimize timeouts**: Adjust `haproxy_timeout` values
3. **Scale horizontally**: Add more HAProxy instances
4. **Check backend performance**: Monitor PostgreSQL server performance

### Health Check Failures

1. **Verify PostgreSQL connectivity**: Ensure PostgreSQL is accessible from HAProxy
2. **Check firewall rules**: Ensure required ports are open
3. **Review health check parameters**: Adjust `haproxy_check_*` settings
4. **Monitor Patroni cluster**: Ensure Patroni is managing PostgreSQL properly

## Best Practices

### Security
- Change default statistics credentials
- Use SSL/TLS termination when possible
- Restrict access to statistics dashboard
- Monitor connection patterns for anomalies

### Performance
- Tune connection limits based on backend capacity
- Use appropriate timeout values for your workload
- Monitor key metrics regularly
- Scale HAProxy instances as needed

### Maintenance
- Test failover scenarios regularly
- Keep HAProxy configuration in version control
- Document custom configurations
- Plan for HAProxy instance maintenance

## License

BSD

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
