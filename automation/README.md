# Autobase: Automation

**Autobase for PostgreSQL®** automates the deployment and management of highly available PostgreSQL clusters in production environments.
It’s designed for dedicated physical servers, virtual machines, and both on-premises and cloud-based infrastructures.

For a detailed overview of the cluster components, see the [Architecture](https://autobase.tech/docs/overview/architecture) page.

## Getting Started
0. [Install Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) on one control node (which could easily be a laptop)

```sh
sudo apt update && sudo apt install -y python3-pip sshpass git
pip3 install ansible
```

1. Install the Autobase Collection

Install directly from Ansible Galaxy:

```
ansible-galaxy collection install vitabaks.autobase
```

Or include it in your requirements.yml:

```yml
collections:
  - name: vitabaks.autobase
    version: 2.2.0
```

2. Prepare your inventory

See the example [inventory](https://github.com/vitabaks/autobase/blob/master/automation/inventory.example) file.
Specify internal IP addresses and connection details such as `ansible_user`, `ansible_ssh_pass`, or `ansible_ssh_private_key_file`.

3. Define variables

See the default collection [variables](https://github.com/vitabaks/autobase/blob/master/automation/roles/common/defaults/main.yml).\
You can override any of them in your inventory, group_vars, or another method that suits your setup.

4. Include the Autobase playbook in your project

```yaml
- name: Run Autobase deployment
  ansible.builtin.include_playbook: vitabaks.autobase.deploy_pgcluster
```

Start with the `deploy_pgcluster` playbook, and switch to `config_pgcluster` afterwards for reconfiguration.

### How to start from scratch

If you need to start from the very beginning, you can use the `remove_cluster` playbook.

Available variables:
- `remove_postgres`: stop the PostgreSQL service and remove data
- `emove_etcd`: stop the ETCD service and remove data
- `remove_consul`: stop the Consul service and remove data

⚠️ Caution: Only use this in non-production or when you’re absolutely sure.

## Support

We provide expert guidance and commercial support — so you can focus on building your project with confidence.\
Choose a support plan that fits your needs: https://autobase.tech/docs/support
