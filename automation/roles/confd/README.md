# Ansible Role: confd

Installs and configures [confd](https://github.com/kelseyhightower/confd) to render HAProxy configuration templates from a distributed configuration store (DCS) such as etcd (used by Patroni / PostgreSQL cluster).

## Variables

| Variable | Default | Description |
|----------|---------|-------------|
| confd_package_repo | `https://github.com/kelseyhightower/confd/releases/download/v0.16.0/confd-0.16.0-linux-{{ confd_architecture_map[ansible_architecture] }}` | URL to download confd binary (used when installation_method=packages). |
| confd_etcd_tls_dir | /etc/confd/tls/etcd | Destination for etcd TLS certs used by confd. |

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
