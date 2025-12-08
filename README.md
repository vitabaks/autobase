<p align="center">
  <img src="images/github-autobase.png">
</p>

# Autobase for PostgreSQL® :elephant: :sparkling_heart:

[![Ansible-lint](https://github.com/vitabaks/autobase/actions/workflows/ansible-lint.yml/badge.svg)](https://github.com/vitabaks/autobase/actions/workflows/ansible-lint.yml)
[![Yamllint](https://github.com/vitabaks/autobase/actions/workflows/yamllint.yml/badge.svg)](https://github.com/vitabaks/autobase/actions/workflows/yamllint.yml)
[![Flake8](https://github.com/vitabaks/autobase/actions/workflows/flake8.yml/badge.svg)](https://github.com/vitabaks/autobase/actions/workflows/flake8.yml)
[![Molecule](https://github.com/vitabaks/autobase/actions/workflows/molecule.yml/badge.svg)](https://github.com/vitabaks/autobase/actions/workflows/molecule.yml)
[![GitHub license](https://img.shields.io/github/license/vitabaks/autobase)](https://github.com/vitabaks/autobase/blob/master/LICENSE)

**Autobase for PostgreSQL®** is an open-source alternative to cloud-managed databases (DBaaS) such as Amazon RDS, Google Cloud SQL, Azure Database, and more.

This automated database platform enables you to create and manage production-ready, highly available PostgreSQL clusters. It simplifies the deployment process, reduces operational costs, and makes database management accessible—even for teams without specialized expertise.

**Automate deployment, failover, backups, restore, upgrades, scaling, and more with ease.**

## Documentation

Autobase documentation can be found [here](https://autobase.tech). Feedback, bug-reports, requests... [welcome](https://github.com/vitabaks/autobase/issues)!

## Quick start

You have the option to deploy Postgres clusters using the Console (UI), command line, or GitOps.

### Console (UI)

The Autobase Console (UI) is the recommended method for most users. It is designed to be user-friendly, minimizing the risk of errors and making it easier than ever to set up your PostgreSQL clusters. This method is suitable for both beginners and those who prefer a visual interface for managing their PostgreSQL clusters.

To run the autobase console, execute the following command:

```
docker run -d --name autobase-console \
  --publish 80:80 \
  --env PG_CONSOLE_AUTHORIZATION_TOKEN=secret_token \
  --env PG_CONSOLE_DOCKER_IMAGE=autobase/automation:latest \
  --volume console_postgres:/var/lib/postgresql \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --volume /tmp/ansible:/tmp/ansible \
  --restart=unless-stopped \
  autobase/console:latest
```

> [!NOTE]
> It is recommended to run the console in the same network as your database servers to enable monitoring of the cluster status.

Alternatively, you can use [Docker Compose](console/README.md).

**Open the Console UI**:

Go to http://localhost:80 (or the address of your server) and use `secret_token` for authorization.

![Cluster creation demo](images/autobase_create_cluster_demo.gif)

Refer to the [Deployment](https://autobase.tech/docs/category/deployment) section to learn more about the different deployment methods.

### Command line

<details><summary>Click here to expand... if you prefer the command line.</summary><p>

The command line mode is suitable for advanced users who require greater flexibility and control over the deployment and management of their PostgreSQL clusters.
While the Console (UI) is designed for ease of use and is suitable for most users, the command line provides powerful options for those experienced in automation and configuration.

> [!NOTE]
> All dependencies and source code are bundled into the `autobase/automation` docker image. This means the deployment process comes down to simply launching a container with a few variable overrides.

1. Prepare your inventory

```bash
curl -fsSL https://raw.githubusercontent.com/vitabaks/autobase/refs/heads/master/automation/inventory.example \
  --output ./inventory
```

Specify IP addresses and appropriate connection settings for your environment, such as ansible_user, ansible_ssh_pass, or ansible_ssh_private_key_file.

```bash
nano ./inventory
```

2. Prepare your variables

Refer to the default [variables](https://github.com/vitabaks/autobase/blob/master/automation/roles/common/defaults/main.yml) for all configurable options. Override them as needed using group_vars, host_vars, or directly in the inventory file.

```bash
mkdir -p ./group_vars
nano ./group_vars/all.yml
```

3. Run the deployment command

```bash
docker run --rm -it \
  -e ANSIBLE_SSH_ARGS="-F none" \
  -e ANSIBLE_INVENTORY=/project/inventory \
  -v $PWD:/project \
  -v $HOME/.ssh:/root/.ssh \
  autobase/automation:latest \
    ansible-playbook deploy_pgcluster.yml
```

Tip: Start with `deploy_pgcluster` for initial provisioning, then use `config_pgcluster` for further configuration changes.

Alternatively, you can use [Ansible Collection](./automation/README.md)

### How to start from scratch

If you need to start from the very beginning, you can use the `remove_cluster` playbook.

Available variables:

- `remove_postgres`: stop the PostgreSQL service and remove data
- `remove_etcd`: stop the ETCD service and remove data
- `remove_consul`: stop the Consul service and remove data

⚠️ Caution: Only use this in non-production or when you’re absolutely sure.

</p></details>

> [!TIP]
> 📩 Contact us at info@autobase.tech, and our team will help you implement Autobase into your infrastructure.

### Supported setups of Postgres Cluster

For a detailed description of the cluster components, visit the [Architecture](https://autobase.tech/docs/overview/architecture) page.

![pg_cluster_scheme](images/pg_cluster_scheme.png#gh-light-mode-only)
![pg_cluster_scheme](images/pg_cluster_scheme.dark_mode.png#gh-dark-mode-only)

## Compatibility

RedHat and Debian based distros.

###### Supported Linux Distributions:

- **Debian**: 11, 12, 13
- **Ubuntu**: 22.04, 24.04
- **CentOS Stream**: 9, 10
- **Oracle Linux**: 8, 9, 10
- **Rocky Linux**: 8, 9, 10
- **AlmaLinux**: 8, 9, 10

Architecture: x86_64 (amd64), aarch64 (arm64).

###### PostgreSQL versions:

all supported PostgreSQL versions

:white_check_mark: tested, works fine: PostgreSQL 10, 11, 12, 13, 14, 15, 16, 17, 18

_Table of results of daily automated testing of cluster deployment:_
| Distribution | Test result |
|--------------|:----------:|
| Debian 12 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_debian12.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_debian12.yml) |
| Debian 13 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_debian13.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_debian13.yml) |
| Ubuntu 22.04 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_ubuntu2204.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_ubuntu2204.yml) |
| Ubuntu 24.04 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_ubuntu2204.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_ubuntu2404.yml) |
| CentOS Stream 9 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_centosstream9.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_centosstream9.yml) |
| CentOS Stream 10 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_centosstream10.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_centosstream10.yml) |
| Oracle Linux 9 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_oracle_linux9.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_oracle_linux9.yml) |
| Oracle Linux 10 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_oracle_linux10.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_oracle_linux10.yml) |
| Rocky Linux 9 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_rockylinux9.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_rockylinux9.yml) |
| Rocky Linux 10 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_rockylinux10.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_rockylinux10.yml) |
| AlmaLinux 9 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_almalinux9.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_almalinux9.yml) |
| AlmaLinux 10 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_almalinux10.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_almalinux10.yml) |

## Project Status

Autobase has been actively developed for over 5 years (since 2019) and is trusted by companies worldwide, including in production environments with high loads and demanding reliability requirements. Our mission is to provide an open-source DBaaS that delivers reliability, flexibility, and cost-efficiency.

**The project will remain open-source forever**, but to ensure its continuous growth and development, we rely on [sponsorship](https://autobase.tech/docs/sponsor). By subscribing to [Autobase packages](https://autobase.tech/docs/support), you gain access to personalized support from the project authors and PostgreSQL experts, ensuring the reliability of your database infrastructure.

## Star us

If you find our project helpful, consider giving it a star on GitHub! Your support helps us grow and motivates us to keep improving. Starring the project is a simple yet effective way to show your appreciation and help others discover it.

<a href="https://star-history.com/#vitabaks/autobase&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=vitabaks/autobase&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=vitabaks/autobase&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=vitabaks/autobase&type=Date" />
  </picture>
</a>

## Sponsor this project

By sponsoring our project, you directly contribute to its continuous improvement and innovation. As a sponsor, you'll receive exclusive benefits, including personalized support, early access to new features, and the opportunity to influence the project's direction. Your sponsorship is invaluable to us and helps ensure the project's sustainability and progress.

Become a sponsor today and help us take this project to the next level!

Support our work through [GitHub Sponsors](https://github.com/sponsors/vitabaks)

[![GitHub Sponsors](https://img.shields.io/github/sponsors/vitabaks?style=for-the-badge)](https://github.com/sponsors/vitabaks)

Support our work through [Patreon](https://www.patreon.com/vitabaks)

[![Support me on Patreon](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dvitabaks%26type%3Dpatrons&style=for-the-badge)](https://patreon.com/vitabaks)

## License

Licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Author

Vitaliy Kukharik (PostgreSQL Expert, Founder Autobase.tech) \
vitaliy@autobase.tech
