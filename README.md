<p align="center">
  <img src="images/github-autobase.png">
</p>

# Autobase for PostgreSQL® :elephant: :sparkling_heart:

[![Ansible-lint](https://github.com/autobase-tech/autobase/actions/workflows/ansible-lint.yml/badge.svg)](https://github.com/autobase-tech/autobase/actions/workflows/ansible-lint.yml)
[![Yamllint](https://github.com/autobase-tech/autobase/actions/workflows/yamllint.yml/badge.svg)](https://github.com/autobase-tech/autobase/actions/workflows/yamllint.yml)
[![Flake8](https://github.com/autobase-tech/autobase/actions/workflows/flake8.yml/badge.svg)](https://github.com/autobase-tech/autobase/actions/workflows/flake8.yml)
[![Molecule](https://github.com/autobase-tech/autobase/actions/workflows/molecule.yml/badge.svg)](https://github.com/autobase-tech/autobase/actions/workflows/molecule.yml)
[![GitHub license](https://img.shields.io/github/license/autobase-tech/autobase)](https://github.com/autobase-tech/autobase/blob/main/LICENSE)

Autobase is an Internal Database Platform for PostgreSQL, bringing the managed database experience of DBaaS into your own infrastructure.

Create and manage production-ready, highly available PostgreSQL clusters. Autobase simplifies deployment, reduces operational costs, and makes database management accessible, even for teams without specialized expertise.

![Cluster creation demo](images/autobase_create_cluster_demo.gif)

**Automate deployment, failover, backups, restore, upgrades, scaling, and more with ease.**

Say goodbye to manual database management 👋

## Documentation

Autobase documentation can be found [here](https://autobase.tech/docs).

## Architecture

![pg_cluster_scheme](images/autobase-postgres.light.png#gh-light-mode-only)
![pg_cluster_scheme](images/autobase-postgres.dark.png#gh-dark-mode-only)

For a detailed description of the cluster components, visit the [Architecture](https://autobase.tech/docs/overview/architecture) page.

## Getting Started

You can deploy PostgreSQL clusters using the Console (UI), command line (Ansible), or GitOps.

### Console (UI)

- [Community Edition](./console/README.md) - Free license for individual developers and hobby projects; includes lightweight cluster deployment.
- [Enterprise Edition](https://autobase.tech/docs#getting-started) - Commercial license for production environments; includes extended cluster management features and support.

### Ansible Collection

- [Ansible Collection](./automation/README.md) - The automation layer for those who prefer Ansible playbooks instead of the database platform.

### GitOps

- [GitOps (CI/CD)](https://autobase.tech/docs/management/gitops) - Manage cluster configuration in Git and apply changes through CI/CD pipelines.

> [!TIP]
> 📩 Contact us at info@autobase.tech, and our team will help you implement Autobase into your infrastructure.

## Compatibility

Red Hat and Debian-based distributions.

###### Supported Linux Distributions:

- **Debian**: 11, 12, 13
- **Ubuntu**: 22.04, 24.04, 26.04
- **CentOS Stream**: 9, 10
- **Oracle Linux**: 8, 9, 10
- **Rocky Linux**: 8, 9, 10
- **AlmaLinux**: 8, 9, 10

Architecture: x86_64 (amd64), aarch64 (arm64).

###### PostgreSQL versions:

All supported PostgreSQL versions.

:white_check_mark: tested, works fine: PostgreSQL 10, 11, 12, 13, 14, 15, 16, 17, 18

_Table of results of daily automated testing of cluster deployment:_
| Distribution | Test result |
|--------------|:----------:|
| Debian 12 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/autobase-tech/autobase/schedule_pg_debian12.yml?branch=main)](https://github.com/autobase-tech/autobase/actions/workflows/schedule_pg_debian12.yml) |
| Debian 13 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/autobase-tech/autobase/schedule_pg_debian13.yml?branch=main)](https://github.com/autobase-tech/autobase/actions/workflows/schedule_pg_debian13.yml) |
| Ubuntu 24.04 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/autobase-tech/autobase/schedule_pg_ubuntu2404.yml?branch=main)](https://github.com/autobase-tech/autobase/actions/workflows/schedule_pg_ubuntu2404.yml) |
| Ubuntu 26.04 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/autobase-tech/autobase/schedule_pg_ubuntu2604.yml?branch=main)](https://github.com/autobase-tech/autobase/actions/workflows/schedule_pg_ubuntu2604.yml) |
| CentOS Stream 9 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/autobase-tech/autobase/schedule_pg_centosstream9.yml?branch=main)](https://github.com/autobase-tech/autobase/actions/workflows/schedule_pg_centosstream9.yml) |
| CentOS Stream 10 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/autobase-tech/autobase/schedule_pg_centosstream10.yml?branch=main)](https://github.com/autobase-tech/autobase/actions/workflows/schedule_pg_centosstream10.yml) |
| Oracle Linux 9 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/autobase-tech/autobase/schedule_pg_oracle_linux9.yml?branch=main)](https://github.com/autobase-tech/autobase/actions/workflows/schedule_pg_oracle_linux9.yml) |
| Oracle Linux 10 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/autobase-tech/autobase/schedule_pg_oracle_linux10.yml?branch=main)](https://github.com/autobase-tech/autobase/actions/workflows/schedule_pg_oracle_linux10.yml) |
| Rocky Linux 9 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/autobase-tech/autobase/schedule_pg_rockylinux9.yml?branch=main)](https://github.com/autobase-tech/autobase/actions/workflows/schedule_pg_rockylinux9.yml) |
| Rocky Linux 10 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/autobase-tech/autobase/schedule_pg_rockylinux10.yml?branch=main)](https://github.com/autobase-tech/autobase/actions/workflows/schedule_pg_rockylinux10.yml) |
| AlmaLinux 9 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/autobase-tech/autobase/schedule_pg_almalinux9.yml?branch=main)](https://github.com/autobase-tech/autobase/actions/workflows/schedule_pg_almalinux9.yml) |
| AlmaLinux 10 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/autobase-tech/autobase/schedule_pg_almalinux10.yml?branch=main)](https://github.com/autobase-tech/autobase/actions/workflows/schedule_pg_almalinux10.yml) |

## Project Status

Autobase has been actively developed for over 7 years (since 2019) and is trusted by companies worldwide, including in production environments with high loads and demanding reliability requirements. Our mission is to provide an open-source DBaaS that delivers reliability, flexibility, and cost-efficiency.

**The project will remain open-source forever**, but to ensure its continuous growth and development, we rely on [sponsorship](https://autobase.tech/docs/sponsor) and [support packages](https://autobase.tech/docs/support). Support packages provide access to personalized support from the project authors and PostgreSQL experts.

## Star us

If you find our project helpful, consider giving it a star on GitHub! Your support helps us grow and motivates us to keep improving. Starring the project is a simple yet effective way to show your appreciation and help others discover it.

<a href="https://star-history.com/#autobase-tech/autobase&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=autobase-tech/autobase&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=autobase-tech/autobase&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=autobase-tech/autobase&type=Date" />
  </picture>
</a>

## License

Licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Author

Vitaliy Kukharik (PostgreSQL Expert, Founder Autobase.tech) \
vitaliy@autobase.tech
