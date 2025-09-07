# Ansible Role: haproxy

This role installs and configures [HAProxy](http://www.haproxy.org/), a reliable, high-performance TCP/HTTP load balancer that provides load balancing and high availability for PostgreSQL database connections.

## Requirements

### Prerequisites

- Target PostgreSQL servers must be accessible
- Network connectivity between HAProxy and PostgreSQL servers
- Proper firewall configuration for HAProxy ports

## Role Variables

### Core Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `with_haproxy_load_balancing` | `false` | Enable HAProxy installation and configuration |

### Port Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `haproxy_listen_port.master` | `5000` | Port for primary database connections |
| `haproxy_listen_port.replicas` | `5001` | Port for read-only replica connections |
| `haproxy_listen_port.replicas_sync` | `5002` | Port for synchronous replica connections |
| `haproxy_listen_port.replicas_async` | `5003` | Port for asynchronous replica connections |
| `haproxy_listen_port.stats` | `7000` | Port for statistics dashboard |
| `haproxy_listen_port.master_direct` | `6000` | Direct primary connections (bypasses PgBouncer) |
| `haproxy_listen_port.replicas_direct` | `6001` | Direct replica connections (bypasses PgBouncer) |
| `haproxy_listen_port.replicas_sync_direct` | `6002` | Direct sync replica connections (bypasses PgBouncer) |
| `haproxy_listen_port.replicas_async_direct` | `6003` | Direct async replica connections (bypasses PgBouncer) |

### Connection Limits

| Variable | Default | Description |
|----------|---------|-------------|
| `haproxy_maxconn.global` | `100000` | Global HAProxy connection limit |
| `haproxy_maxconn.master` | `10000` | Per-master backend connection limit |
| `haproxy_maxconn.replica` | `10000` | Per-replica backend connection limit |

### Timeout Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `haproxy_timeout.client` | `"60m"` | Client connection timeout |
| `haproxy_timeout.server` | `"60m"` | Server connection timeout |

### Advanced Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `haproxy_log_format` | `""` | Custom log format (JSON structured logging available) |

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Tags

Use these tags to run specific parts of the role:

- `haproxy`: Run all HAProxy tasks
- `load_balancing`: Run load balancing configuration tasks
- `haproxy_conf`: Configure HAProxy only
- `haproxy_service`: Manage HAProxy service only
- `haproxy_selinux`: Configure SELinux policies only

## License

MIT

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
