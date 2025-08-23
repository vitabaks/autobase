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
