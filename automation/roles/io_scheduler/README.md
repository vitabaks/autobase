# Ansible Role: io_scheduler

Configures Linux I/O scheduler and request queue depth for specified block devices via a systemd unit (`io-scheduler.service`). Applies settings at boot and on demand.

## Variables

| Variable | Default | Description |
|----------|---------|-------------|
| set_scheduler | false | Toggle for enabling/disabling this role’s configuration. |
| scheduler | [] | List of device tuning items. Each item: { sched: "<scheduler>", nr_requests: "<number>", device: "<block device>" }. |

Item fields:
- `sched`: one of noop, deadline, mq-deadline, or none.
- `nr_requests`: number of I/O requests kept in the queue (e.g., "1024").
- `device`: block device name (e.g., "sdb", "nvme1n1").

### Example

```yaml
scheduler:
  - { sched: "none" , nr_requests: "1024", device: "nvme1n1" }
```

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
