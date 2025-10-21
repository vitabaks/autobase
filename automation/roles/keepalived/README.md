# Ansible Role: keepalived

This role installs and configures [Keepalived](https://www.keepalived.org/), a routing software providing high availability for HAProxy load balancers through VRRP (Virtual Router Redundancy Protocol). It ensures continuous load balancer availability and it provides a single access point to the database.

Note: VIP-based solutions such as keepalived may not function correctly in cloud environments.

## Role Variables

| Variable | Default | Description |
|----------|---------|-------------|
| cluster_vip | "" | Virtual IP Address (VIP) for client access to the databases in the cluster. |
| vip_interface | "{{ ansible_default_ipv4.interface }}" | Network interface where the VIP is configured (e.g., "ens32"). |
| keepalived_virtual_router_id | | The last octet of 'cluster_vip' IP address is used by default. Must be unique in the network (available values are 0..255). |
| keepalived_instances | _See below_ | List of VRRP instance definitions. Fields: name, state, interface, virtual_router_id, priority, advert_int, check_status_command, authentication.{auth_type,auth_pass}, virtual_ipaddresses. |

Default `keepalived_instances` structure:

```yaml
keepalived_instances:
  - name: VI_1
    state: BACKUP
    interface: "{{ vip_interface }}"
    virtual_router_id: "{{ keepalived_virtual_router_id | default(123) }}"
    priority: 100
    advert_int: 2
    check_status_command: /usr/libexec/keepalived/haproxy_check.sh
    authentication:
      auth_type: PASS
      auth_pass: "1ce24b6e"
    virtual_ipaddresses:
      - "{{ cluster_vip }}"
```

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
