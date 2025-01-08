<p align="center">
  <img src="images/github-autobase.png">
</p>

# Autobase for PostgreSQL® :elephant: :sparkling_heart:

[<img src="https://github.com/vitabaks/autobase/workflows/Ansible-lint/badge.svg?branch=master">](https://github.com/vitabaks/autobase/actions?query=workflow%3AAnsible-lint)
[<img src="https://github.com/vitabaks/autobase/workflows/Yamllint/badge.svg?branch=master">](https://github.com/vitabaks/autobase/actions?query=workflow%3AYamllint)
[<img src="https://github.com/vitabaks/autobase/workflows/Flake8/badge.svg?branch=master">](https://github.com/vitabaks/autobase/actions?query=workflow%3AFlake8)
[<img src="https://github.com/vitabaks/autobase/workflows/Molecule/badge.svg?branch=master">](https://github.com/vitabaks/autobase/actions?query=workflow%3AMolecule)
[![GitHub license](https://img.shields.io/github/license/vitabaks/autobase)](https://github.com/vitabaks/autobase/blob/master/LICENSE) 
![GitHub stars](https://img.shields.io/github/stars/vitabaks/autobase)

**Autobase for PostgreSQL®** is an open-source alternative to cloud-managed databases (DBaaS) such as Amazon RDS, Google Cloud SQL, Azure Database, and more.

This automated database platform enables you to create and manage production-ready, highly available PostgreSQL clusters. It simplifies the deployment process, reduces operational costs, and makes database management accessible—even for teams without specialized expertise.

**Automate failover, backups, restore, upgrades, scaling, and more with ease.**

You can find a version of this documentation that is searchable and also easier to navigate at [autobase.tech](http://autobase.tech)

<a href="https://www.producthunt.com/posts/postgresql-cluster-org?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-postgresql&#0045;cluster&#0045;org" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=583645&theme=light" alt="postgresql&#0045;cluster&#0046;org - The&#0032;open&#0045;source&#0032;alternative&#0032;to&#0032;cloud&#0045;managed&#0032;databases | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

:trophy: **Use the [sponsoring](https://github.com/vitabaks/autobase#sponsor-this-project) program to get personalized support, or just to contribute to this project.**

---

### Supported setups of Postgres Cluster

![pg_cluster_scheme](images/pg_cluster_scheme.png#gh-light-mode-only)
![pg_cluster_scheme](images/pg_cluster_scheme.dark_mode.png#gh-dark-mode-only)

You have three schemes available for deployment:

#### 1. PostgreSQL High-Availability only

This is simple scheme without load balancing.

##### Components:

- [**Patroni**](https://github.com/zalando/patroni) is a template for you to create your own customized, high-availability solution using Python and - for maximum accessibility - a distributed configuration store like ZooKeeper, etcd, Consul or Kubernetes. Used for automate the management of PostgreSQL instances and auto failover.

- [**etcd**](https://github.com/etcd-io/etcd) is a distributed reliable key-value store for the most critical data of a distributed system. etcd is written in Go and uses the [Raft](https://raft.github.io/) consensus algorithm to manage a highly-available replicated log. It is used by Patroni to store information about the status of the cluster and PostgreSQL configuration parameters. [What is Distributed Consensus?](http://thesecretlivesofdata.com/raft/)

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

- [**HAProxy**](http://www.haproxy.org/) is a free, very fast and reliable solution offering high availability, load balancing, and proxying for TCP and HTTP-based applications. 

- [**confd**](https://github.com/kelseyhightower/confd) manage local application configuration files using templates and data from etcd or consul. Used to automate HAProxy configuration file management.

- [**Keepalived**](https://github.com/acassen/keepalived)  (_optional, if the `cluster_vip` variable is specified_) provides a virtual high-available IP address (VIP) and single entry point for databases access.
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
| Debian 11    | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_debian11.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_debian11.yml) |
| Debian 12    | [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vitabaks/autobase/schedule_pg_debian11.yml?branch=master)](https://github.com/vitabaks/autobase/actions/workflows/schedule_pg_debian12.yml) |
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

![Cluster creation demo](images/pg_console_create_cluster_demo.gif)

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
vitabaks@gmail.com

## Feedback, bug-reports, requests, ...
Are [welcome](https://github.com/vitabaks/autobase/issues)!
