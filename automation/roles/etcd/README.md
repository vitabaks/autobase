# Ansible Role: etcd

This role installs and configures [etcd](https://etcd.io/), a distributed, reliable key-value store used as the backend for service discovery and cluster coordination, serving as the Distributed Configuration Store (DCS) for Patroni.

## Requirements

### Operating System Support

- **Debian**: 11, 12, 13
- **Ubuntu**: 22.04, 24.04
- **CentOS Stream**: 9, 10
- **Oracle Linux**: 8, 9, 10
- **Rocky Linux**: 8, 9, 10
- **AlmaLinux**: 8, 9, 10

### Prerequisites

- Network connectivity between etcd cluster members
- Sufficient disk space and IOPS for etcd data
- Proper time synchronization between cluster members
- Open firewall ports for etcd communication

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `etcd_cluster_name` | `"etcd-cluster"` | etcd cluster name |
| `etcd_bind_address` | `"{{ ansible_default_ipv4.address }}"` | IP address to bind etcd services |
| `etcd_data_dir` | `"/var/lib/etcd"` | etcd data directory |
| `etcd_client_port` | `2379` | Client communication port |
| `etcd_peer_port` | `2380` | Peer communication port |
| `etcd_installation_method` | `"package"` | Installation method (`package` or `binary`) |
| `etcd_package_repo` | `https://github.com/etcd-io/etcd/releases/download/...` | Package repository URL for binary installation |
| `etcd_version` | `"3.5.10"` | etcd version |
| `etcd_listen_client_urls` | `http://{{ etcd_bind_address }}:{{ etcd_client_port }},http://localhost:{{ etcd_client_port }}` | Client URLs to listen on |
| `etcd_advertise_client_urls` | `http://{{ etcd_bind_address }}:{{ etcd_client_port }}` | Client URLs to advertise |
| `etcd_listen_peer_urls` | `http://{{ etcd_bind_address }}:{{ etcd_peer_port }}` | Peer URLs to listen on |
| `etcd_initial_advertise_peer_urls` | `http://{{ etcd_bind_address }}:{{ etcd_peer_port }}` | Peer URLs to advertise |
| `etcd_enable_tls` | `false` | Enable TLS security |
| `etcd_cert_file` | `""` | TLS certificate file path |
| `etcd_key_file` | `""` | TLS key file path |
| `etcd_ca_file` | `""` | TLS CA file path |
| `etcd_snapshot_count` | `100000` | Number of committed transactions to snapshot |
| `etcd_max_snapshots` | `5` | Maximum number of snapshots to retain |
| `etcd_max_wals` | `5` | Maximum number of WAL files to retain |
| `etcd_heartbeat_interval` | `100` | Heartbeat interval in milliseconds |
| `etcd_election_timeout` | `1000` | Election timeout in milliseconds |
| `etcd_request_timeout` | `10` | Request timeout in seconds |

## Dependencies

```yaml
dependencies:
  - role: vitabaks.autobase.common
```

## Tags

Use these tags to run specific parts of the role:

- `etcd`: Run all etcd tasks
- `etcd_install`: Install etcd only

## License

MIT

## Author Information

This role is part of the [Autobase](https://github.com/vitabaks/autobase) project for automated PostgreSQL database platform deployment.
