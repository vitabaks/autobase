# Autobase: Automation

**Autobase for PostgreSQL®** automates the deployment and management of highly available PostgreSQL clusters in production environments. This solution is tailored for use on dedicated physical servers, virtual machines, and within both on-premises and cloud-based infrastructures.

For a detailed description of the cluster components, visit the [Architecture](https://autobase.tech/docs/overview/architecture) page.

## Getting Started

1. [Install Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) on one control node (which could easily be a laptop)

```sh
sudo apt update && sudo apt install -y python3-pip sshpass git
pip3 install ansible
```

1. Install the Ansible Collection

```sh
# from Ansible Galaxy
ansible-galaxy collection install vitabaks.autobase

# via git
ansible-galaxy collection install \
  git+https://github.com/vitabaks/autobase.git,subdirectory=automation,version=master
```

Or reference it in a `requirements.yml`:

```yml
# from Ansible Galaxy
collections:
  - name: vitabaks.autobase
    version: 2.2.0

# via git
collections:
  - name: vitabaks.autobase
    type: git
    version: master # or a tag/commit
    source: https://github.com/vitabaks/autobase.git
    subdirectory: automation
```

1. Prepare the inventory

See example of [inventory](./inventory.example) file.

Specify (non-public) IP addresses and connection settings (`ansible_user`, `ansible_ssh_pass` or `ansible_ssh_private_key_file` for your environment

1. Prepare variables

See the [main.yml](./roles/common/defaults/main.yml), [system.yml](./roles/common/defaults/system.yml) and ([Debian.yml](./roles/common/defaults/Debian.yml) or [RedHat.yml](./roles/common/defaults/RedHat.yml)) variable files for more details.

1. Test host connectivity

```sh
ansible all -m ping
```

5. Create playbooks to execute the playbooks within the collection:

```yaml
- name: Playbook
  hosts: <node group name>

  tasks:
    # Start with the 'deploy' playbook, change to 'config' afterwards
    - name: Run playbook
      ansible.builtin.include_playbook: vitabaks.autobase.deploy_pgcluster
```

#### How to start from scratch

If you need to start from the very beginning, you can use the `remove_cluster` playbook.

Available variables:

- `remove_postgres`: stop the PostgreSQL service and remove data.
- `remove_etcd`: stop the ETCD service and remove data.
- `remove_consul`: stop the Consul service and remove data.

:warning: **Caution:** be careful when running this command in a production environment.

## Support

We provide personalized support and expert assistance, so you can focus on building your project with confidence, knowing that a reliable partner is always available when you need help.

Choose the support plan that fits your needs: https://autobase.tech/docs/support
