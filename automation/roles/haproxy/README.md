# Ansible Role: haproxy

This role installs and configures [HAProxy](http://www.haproxy.org/), a reliable, high-performance TCP/HTTP load balancer that provides load balancing and high availability for PostgreSQL database connections.

## Requirements

### Operating System Support

- **Debian**: 11, 12, 13
- **Ubuntu**: 22.04, 24.04
- **CentOS Stream**: 9, 10
- **Oracle Linux**: 8, 9, 10
- **Rocky Linux**: 8, 9, 10
- **AlmaLinux**: 8, 9, 10

### Prerequisites

- Target PostgreSQL servers must be accessible
- Network connectivity between HAProxy and PostgreSQL servers
- Proper firewall configuration for HAProxy ports

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `haproxy_listen_port.master` | `5000` | Port for primary database connections |
| `haproxy_listen_port.replicas` | `5001` | Port for read-only replica connections |
| `haproxy_listen_port.replicas_sync` | `5002` | Port for synchronous replica connections |
| `haproxy_listen_port.replicas_async` | `5003` | Port for asynchronous replica connections |
| `haproxy_listen_port.stats` | `7000` | Port for statistics dashboard |
| `haproxy_maxconn.global` | `100000` | Global HAProxy connection limit |
| `haproxy_maxconn.master` | `10000` | Per-master backend connection limit |
| `haproxy_maxconn.replica` | `10000` | Per-replica backend connection limit |
| `haproxy_timeout.client` | `"60m"` | Client connection timeout |
| `haproxy_timeout.server` | `"60m"` | Server connection timeout |
| `haproxy_timeout.connect` | `"10s"` | Connection establishment timeout |
| `haproxy_timeout.check` | `"10s"` | Health check timeout |

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
