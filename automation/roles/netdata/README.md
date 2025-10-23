# Ansible Role: netdata

Installs and configures [Netdata](https://github.com/netdata/netdata) using the official kickstart script.

## Role Variables

| Variable | Default | Description |
|---|---|---|
| netdata_install | true | Enable Netdata installation and configuration. |
| netdata_kickstart_url | `https://get.netdata.cloud/kickstart.sh` | URL to the Netdata kickstart installer script. |
| netdata_install_options | --stable-channel --disable-telemetry --dont-wait | Extra options passed to [kickstart.sh](https://learn.netdata.cloud/docs/netdata-agent/installation/linux/). |
| netdata_install_ignore_errors | true | Continue playbook even if Netdata installation/config fails. |
| netdata_conf.web_default_port | "19999" | Port for the Netdata web UI. |
| netdata_conf.web_bind_to | "*" | Address to bind the Netdata web server. |
| netdata_conf.db_mode | "dbengine" | Storage mode: dbengine, ram, none. |
| netdata_conf.dbengine_page_cache_size | "64MiB" | In-memory page cache size. |
| netdata_conf.dbengine_tier_0_retention_size | "1024MiB" | Tier 0 retention size (per-second data). |
| netdata_conf.dbengine_tier_0_retention_time | "14d" | Tier 0 retention time. |
| netdata_conf.dbengine_tier_1_retention_size | "1024MiB" | Tier 1 retention size (per-minute data). |
| netdata_conf.dbengine_tier_1_retention_time | "3mo" | Tier 1 retention time. |
| netdata_conf.dbengine_tier_2_retention_size | "1024MiB" | Tier 2 retention size (per-hour data). |
| netdata_conf.dbengine_tier_2_retention_time | "1y" | Tier 2 retention time. |

## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
