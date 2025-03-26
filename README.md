<p align="center">
  <img src="images/github-autobase.png">
</p>

# Autobase for PostgreSQL® :elephant: :sparkling_heart:

[![Ansible-lint](https://github.com/vitabaks/autobase/actions/workflows/ansible-lint.yml/badge.svg)](https://github.com/vitabaks/autobase/actions/workflows/ansible-lint.yml)
[![Yamllint](https://github.com/vitabaks/autobase/actions/workflows/yamllint.yml/badge.svg)](https://github.com/vitabaks/autobase/actions/workflows/yamllint.yml)
[![Flake8](https://github.com/vitabaks/autobase/actions/workflows/flake8.yml/badge.svg)](https://github.com/vitabaks/autobase/actions/workflows/flake8.yml)
[![Molecule](https://github.com/vitabaks/autobase/actions/workflows/molecule.yml/badge.svg)](https://github.com/vitabaks/autobase/actions/workflows/molecule.yml)
[![GitHub license](https://img.shields.io/github/license/vitabaks/autobase)](https://github.com/vitabaks/autobase/blob/master/LICENSE)
![GitHub stars](https://img.shields.io/github/stars/vitabaks/autobase)

**Autobase for PostgreSQL®** is an open-source alternative to cloud-managed databases (DBaaS) such as Amazon RDS, Google Cloud SQL, Azure Database, and more.

This automated database platform enables you to create and manage production-ready, highly available PostgreSQL clusters. It simplifies the deployment process, reduces operational costs, and makes database management accessible—even for teams without specialized expertise.

**Automate deployment, failover, backups, restore, upgrades, scaling, and more with ease.**

You can find a version of this documentation that is searchable and also easier to navigate at [autobase.tech](https://autobase.tech)

---

### Project Status

Autobase has been actively developed for over 5 years (since 2019) and is trusted by companies worldwide, including in production environments with high loads and demanding reliability requirements. Our mission is to provide an open-source DBaaS that delivers reliability, flexibility, and cost-efficiency.

The project will remain open-source forever, but to ensure its continuous growth and development, we rely on [sponsorship](https://autobase.tech/docs/sponsor). By subscribing to [Autobase packages](https://autobase.tech/docs/support), you gain access to personalized support from the project authors and PostgreSQL experts, ensuring the reliability of your database infrastructure.

---

### Supported setups of Postgres Cluster

![pg_cluster_scheme](images/pg_cluster_scheme.png#gh-light-mode-only)
![pg_cluster_scheme](images/pg_cluster_scheme.dark_mode.png#gh-dark-mode-only)

You have three schemes available for deployment:

#### 1. PostgreSQL High-Availability only

This is simple scheme without load balancing.

##### Components:

- [**Patroni**](https://github.com/zalando/patroni) is a template for you to create your own customized, high-availability solution using Python and - for maximum accessibility - a distributed configuration store like ZooKeeper, etcd, Consul or Kubernetes. Used for automate the management of PostgreSQL instances and auto failover.

- [**etcd**](https://github.com/etcd-io/etcd) is a distributed reliable key-value store for the most critical data of a distributed system. etcd is written in Go and uses the [Raft](https://raft.github.io/) consensus algorithm to manage a highly-available replicated log. It is used by Patroni to store information about the status of the cluster and PostgreSQL configuration parameters. [What is Distributed Consensus?](https://thesecretlivesofdata.com/raft/)

- [**vip-manager**](https://github.com/cybertec-postgresql/vip-manager) (_optional, if the `cluster_vip` variable is specified_) is a service that gets started on all cluster nodes and connects to the DCS. If the local node owns the leader-key, vip-manager starts the configured VIP. In case of a failover, vip-manager removes the VIP on the old leader and the corresponding service on the new leader starts it there. Used to provide a single entry point (VIP) for database access.

- [**PgBouncer**](https://pgbouncer.github.io/features.html) (optional, if the `pgbouncer_install` variable is `true`) is a connection pooler for PostgreSQL.

#### 2. PostgreSQL High-Availability with Load Balancing

This scheme enables load distribution for read operations and also allows for scaling out the cluster with read-only replicas.

When deploying to cloud providers such as AWS, GCP, Azure, DigitalOcean, and Hetzner Cloud, a cloud load balancer is automatically created by default to provide a single entry point to the database (controlled by the `cloud_load_balancer` variable).

For non-cloud environments, such as when deploying on Your Own Machines, the HAProxy load balancer is available for use. To enable it, set `with_haproxy_load_balancing: true` in the vars/main.yml file.

> [!NOTE]
> Your application must have support sending read requests to a custom port 5001, and write requests to port 5000.

List of ports when using HAProxy:

- port 5000 (read / write) master
- port 5001 (read only) all replicas
- port 5002 (read only) synchronous replica only
- port 5003 (read only) asynchronous replicas only

##### Components of HAProxy load balancing:

- [**HAProxy**](https://www.haproxy.org/) is a free, very fast and reliable solution offering high availability, load balancing, and proxying for TCP and HTTP-based applications.

- [**confd**](https://github.com/kelseyhightower/confd) manage local application configuration files using templates and data from etcd or consul. Used to automate HAProxy configuration file management.

- [**Keepalived**](https://github.com/acassen/keepalived) (_optional, if the `cluster_vip` variable is specified_) provides a virtual high-available IP address (VIP) and single entry point for databases access.
  Implementing VRRP (Virtual Router Redundancy Protocol) for Linux. In our configuration keepalived checks the status of the HAProxy service and in case of a failure delegates the VIP to another server in the cluster.

#### 3. PostgreSQL High-Availability with Consul Service Discovery

To use this scheme, specify `dcs_type: consul` in variable file vars/main.yml

This scheme is suitable for master-only access and for load balancing (using DNS) for reading across replicas. Consul [Service Discovery](https://developer.hashicorp.com/consul/docs/concepts/service-discovery) with [DNS resolving ](https://developer.hashicorp.com/consul/docs/discovery/dns) is used as a client access point to the database.

Client access point (example):

- `master.postgres-cluster.service.consul`
- `replica.postgres-cluster.service.consul`

Besides, it can be useful for a distributed cluster across different data centers. We can specify in advance which data center the database server is located in and then use this for applications running in the same data center.

Example: `replica.postgres-cluster.service.dc1.consul`, `replica.postgres-cluster.service.dc2.consul`

It requires the installation of a consul in client mode on each application server for service DNS resolution (or use [forward DNS](https://developer.hashicorp.com/consul/tutorials/networking/dns-forwarding?utm_source=docs) to the remote consul server instead of installing a local consul client).

## Compatibility

RedHat and Debian based distros (x86_64)

###### Supported Linux Distributions:

- **Debian**: 11, 12
- **Ubuntu**: 22.04, 24.04
- **CentOS Stream**: 9
- **Oracle Linux**: 8, 9
- **Rocky Linux**: 8, 9
- **AlmaLinux**: 8, 9

###### PostgreSQL versions:

all supported PostgreSQL versions

:white_check_mark: tested, works fine: PostgreSQL 10, 11, 12, 13, 14, 15, 16, 17

_Table of results of daily automated testing of cluster deployment:_
| Distribution | Test result |
|--------------|:----------:|
| Debian 11 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_debian11.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_debian11.yml) |
| Debian 12 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_debian11.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_debian12.yml) |
| Ubuntu 22.04 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_ubuntu2204.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_ubuntu2204.yml) |
| Ubuntu 24.04 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_ubuntu2204.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_ubuntu2404.yml) |
| CentOS Stream 9 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_centosstream9.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_centosstream9.yml) |
| Oracle Linux 8 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_oracle_linux8.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_oracle_linux8.yml) |
| Oracle Linux 9 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_oracle_linux9.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_oracle_linux9.yml) |
| Rocky Linux 8 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_rockylinux8.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_rockylinux8.yml) |
| Rocky Linux 9 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_rockylinux9.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_rockylinux9.yml) |
| AlmaLinux 8 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_almalinux8.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_almalinux8.yml) |
| AlmaLinux 9 | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_almalinux9.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_almalinux9.yml) |

## Getting Started

You have the option to easily deploy Postgres clusters using the Console (UI), command line, or GitOps.

> [!TIP]
> 📩 **Contact us at info@autobase.tech**, and our team will provide you with detailed deployment instructions and help you implement Autobase into your infrastructure.

Deploying and managing PostgreSQL clusters can be challenging, especially without a dedicated database administrator (DBA).
With **Autobase**, it becomes simpler: alongside powerful automation tools, you get **DBA as a Service (DBAaaS)**.
This means access to PostgreSQL experts who will assist with deployment, maintenance, and optimization, ensuring your clusters run smoothly.

Explore our [support packages](https://autobase.tech/docs/support) to find a plan that fits your needs.

![Cluster creation demo](images/autobase_create_cluster_demo.gif)

Refer to the [Deployment](https://autobase.tech/docs/category/deployment) section to learn more about the different deployment methods.

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

Vitaliy Kukharik (PostgreSQL DBA) \
vitaliy@autobase.tech

## Feedback, bug-reports, requests, ...

Are [welcome](https://github.com/vitabaks/autobase/issues)!

# Autobase Testing Framework

This repository contains testing scripts for validating Autobase functionality, focusing on PostgreSQL clusters, S3 backups, and other integrated services.

## Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd autobase-testing
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env  # On Windows: copy .env.example .env
   # Edit the .env file with your preferred editor
   ```
   Fill in the appropriate values for your environment.

3. **Load environment variables**:
   
   **Linux/macOS**:
   ```bash
   chmod +x load_env.sh
   source ./load_env.sh
   ```
   
   **Windows PowerShell**:
   ```powershell
   # First, make the scripts executable if needed
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   
   # Then load environment variables
   . .\load_env.ps1  # Note: You need the load_env.ps1 version for PowerShell
   ```

## Available Tests

### Standby Cluster Test
Validates the PostgreSQL standby cluster functionality including replication, backup/restore, and WAL archiving.

**Linux/macOS**:
```bash
chmod +x test_standby_cluster.sh
./test_standby_cluster.sh
```

**Windows PowerShell**:
```powershell
.\test_standby_cluster.ps1  # If using PowerShell versions
# OR
bash .\test_standby_cluster.sh  # If using Git Bash or WSL
```

### S3 Backup Test
Tests the S3 backup and restore functionality for PostgreSQL.

**Linux/macOS**:
```bash
chmod +x tests/test_s3_backup.sh
./tests/test_s3_backup.sh
```

**Windows PowerShell**:
```powershell
.\tests\test_s3_backup.ps1  # If using PowerShell versions
# OR
bash .\tests\test_s3_backup.sh  # If using Git Bash or WSL
```

### Full Test Suite
Runs all available tests in sequence.

**Linux/macOS**:
```bash
chmod +x test_all_modules.sh
./test_all_modules.sh
```

**Windows PowerShell**:
```powershell
.\test_all_modules.ps1  # If using PowerShell versions
# OR
bash .\test_all_modules.sh  # If using Git Bash or WSL
```

## Configuration Files

- `test_standby_cluster.yml`: Configuration for standby cluster tests
- `tests/test_s3_backup.yml`: Configuration for S3 backup tests

## Security Considerations

- Never commit the `.env` file to version control
- The `.env.example` file provides a template without sensitive information
- All scripts use environment variables for sensitive information (AWS credentials, database passwords, etc.)
- Scripts will prompt for missing credentials when needed

## Troubleshooting

### Missing Credentials
If you encounter errors related to missing credentials:
1. Ensure you've properly loaded the environment variables
2. Check that your `.env` file contains all required variables
3. You can always provide credentials interactively when prompted by the test scripts

### Connection Issues
If you encounter connection issues:
1. Verify that your PostgreSQL hosts are reachable
2. Check that the configured ports are open and accessible
3. Ensure your AWS credentials have the necessary permissions for S3 operations

### Windows-Specific Issues
If running scripts on Windows:
1. Use PowerShell with execution policy set to allow the scripts to run
2. Consider using Git Bash or WSL (Windows Subsystem for Linux) for a more Linux-like environment
3. If using PowerShell, ensure you have the `.ps1` versions of the scripts

## Extending the Framework

To add new tests:
1. Create a configuration YAML file for your test
2. Develop a test script that loads configuration from the YAML
3. Update the `test_all_modules.sh` script to include your new test
4. Document the new test in this README

## Contributing

When contributing to this repository, please:
- Follow the existing code style
- Add appropriate error handling to new scripts
- Update documentation for any new features
- Ensure all sensitive information is handled via environment variables
- Test your changes thoroughly before submitting a pull request
