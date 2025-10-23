# Ansible Role: ntp

Installs and configures time synchronization using Chrony (default) or NTP:
- Cleans conflicting services (systemd-timesyncd, ntp*, openntpd) when using Chrony.
- Renders chrony.conf or ntp.conf from templates and restarts the service.
- Applies a systemd override for chronyd in containers on RedHat-based distros.

## Role Variables

| Variable | Default | Description |
|---|---|---|
| ntp_enabled | true | Enable installation and configuration of the time sync service. |
| ntp_package | "chrony" | Service to install and configure: "chrony" or "ntp". |
| ntp_servers | [] | List of upstream NTP servers; used by templates. |
| chrony_enable_logging | false | Enable Chrony logging. |
| chrony_maxupdateskew | "100.0" | Max acceptable update skew. |
| chrony_makestep_threshold | "1" | Step threshold (seconds) for makestep. |
| chrony_makestep_limit | "-1" | Number of initial updates to allow stepping (-1 unlimited). |
| chrony_maxdistance | "1000000000" | Max root distance. |
| chrony_leapsectz | true | Use system time zone for leap seconds. |
| chrony_minsources | 2 | Minimum number of sources to select synchronisation. |
| chrony_allow_networks | [] | List of CIDRs allowed to query/peer (Chrony allow). |

Notes:
- chrony.conf destination is /etc/chrony/chrony.conf on Debian family and /etc/chrony.conf on RedHat family.

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
