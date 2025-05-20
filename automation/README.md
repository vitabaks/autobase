# Autobase Automation: Ansible Collection

**Autobase for PostgreSQL®** automates the deployment and management of highly available PostgreSQL clusters in production environments. This solution is tailored for use on dedicated physical servers, virtual machines, and within both on-premises and cloud-based infrastructures.

For a detailed overview of the cluster components, see the [Architecture](https://autobase.tech/docs/overview/architecture) page.

## Getting Started

1. Install the Autobase Collection

Install directly from Ansible Galaxy:

```sh
ansible-galaxy collection install vitabaks.autobase
```

Or include it in your requirements.yml:

```yaml
collections:
  - name: vitabaks.autobase
    version: 2.2.0
```

2. Prepare your inventory

See the example [inventory](https://github.com/vitabaks/autobase/blob/master/automation/inventory.example) file. Specify internal IP addresses and connection details such as `ansible_user`, `ansible_ssh_pass`, or `ansible_ssh_private_key_file`.

3. Define variables

Review default [variables](https://github.com/vitabaks/autobase/blob/master/automation/roles/common/defaults/main.yml). Override them in your inventory, group_vars, or other appropriate locations.

4. Use Autobase playbook

```yaml
- name: Run Autobase deployment
  ansible.builtin.include_playbook: vitabaks.autobase.deploy_pgcluster
```

Note: Start with `deploy_pgcluster`, and use `config_pgcluster` later for reconfiguration.

### How to start from scratch

If you need to start from the very beginning, you can use the `remove_cluster` playbook.

Available variables:
- `remove_postgres`: stop the PostgreSQL service and remove data
- `remove_etcd`: stop the ETCD service and remove data
- `remove_consul`: stop the Consul service and remove data

⚠️ Caution: Only use this in non-production or when you’re absolutely sure.

## Internal Structure: Roles and Playbooks

Autobase adheres to a modular design separating atomic logic (roles) and orchestration logic (playbooks):

- **Roles** under `roles/` are designed to perform focused, reusable tasks (e.g., configuring Patroni, setting up firewall rules, installing extensions).  
  Most roles are not intended to be used standalone, but instead serve as building blocks.
- **Playbooks** under `playbooks/` implement orchestration logic — combining roles into coherent workflows such as deploying a cluster, upgrading PostgreSQL, or performing cleanup.  
  These playbooks represent full automation scenarios and manage host group coordination, conditions, and lifecycle sequencing.

### List of Playbooks

###### 🚀 Deployment
- `deploy_pgcluster` – Deploy a new highly available PostgreSQL cluster. This playbook also includes:
  - `etcd_cluster` – Provision and configure a new etcd cluster as the DCS (used if dcs_type: etcd).
  - `consul_cluster` – Provision and configure a new Consul cluster as the DCS (used if dcs_type: consul).
  - `balancers` – Deploy HAProxy for routing client traffic (used if with_haproxy_load_balancing: true).

###### 🛠️ Maintenance
- `config_pgcluster` – Reconfigure PostgreSQL cluster settings (users, databases, extensions, etc.) after the initial deployment.
- `update_pgcluster` – Perform rolling updates of PostgreSQL or system packages with minimal downtime.
- `pg_upgrade` – Perform a major version in-place upgrade of PostgreSQL with minimal downtime.

###### ⬆️ Scaling
- `add_pgnode` – Add a new PostgreSQL replica node to an existing cluster.
- `add_balancer` – Add a new HAProxy load balancer node to the cluster (used if with_haproxy_load_balancing: true).

###### 🧹 Removal
- `remove_cluster` – Remove the PostgreSQL cluster and optionally its DCS (etcd or Consul), including all data from the server.
