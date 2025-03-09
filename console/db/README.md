## Database Schema for Autobase Console

### Introduction

This project uses [Goose](https://github.com/pressly/goose) for versioning and managing database schema changes. Goose is a database migration tool that enables database version control, much like Git does for source code. It allows defining and tracking changes in the database schema over time, ensuring consistency and reproducibility. The backend service is responsible for applying migrations.

For more information on using Goose, see the [Goose documentation](https://github.com/pressly/goose).

### Database Migrations

Database migrations are SQL scripts that modify the schema of the database. Each migration script should be placed in the `console/db/migrations` directory and follow Goose's naming convention to ensure they are applied in the correct order.

**Naming Convention**
Goose uses a specific naming convention to order and apply migrations:

- Versioned Migrations: These migrations have a version number and are applied in sequence. The naming format is `<version>_<description>.sql`
  - Example: `20240520144338_initial_scheme_setup`
  - Note: You can use the following command `goose create mogration_file_name sql` to create a new migration file.

Example migrations:

```shell
goose -dir ./console/db/migrations postgres \
"host=<host> port=5432 user=postgres password=<password> dbname=<database>" \
up
```

### Validating Migrations

To check the status of migrations, run:

```shell
goose -dir ./console/db/migrations postgres \
"host=<host> port=5432 user=postgres password=<password> dbname=<database>" \
status
```

Output example:

```
status

2024/05/20 17:50:33     Applied At                  Migration
2024/05/20 17:50:33     =======================================
2024/05/20 17:50:33     Mon May 20 14:49:26 2024 -- 20240520144338_2.0.0_initial_scheme_setup.sql
```

### Database Schema

#### Tables:

- `cloud_providers`
  - Table containing cloud providers information
- `cloud_regions`
  - Table containing cloud regions information for various cloud providers
- `cloud_instances`
  - Table containing cloud instances information (including the approximate price) for various cloud providers
- `cloud_volumes`
  - Table containing cloud volume information (including the approximate price) for various cloud providers
- `cloud_images`
  - Table containing cloud images information for various cloud providers
    - Note: For all cloud providers except AWS, the image is the same for all regions. For AWS, the image must be specified for each specific region.
- `secrets`
  - Table containing secrets for accessing cloud providers and servers
    - Note: The data is encrypted using the pgcrypto extension and a symmetric key. This symmetric key is generated at the application level and is unique for each installation.
- `projects`
  - Table containing information about projects
    - Default: 'default'
- `environments`
  - Table containing information about environments
    - Default: 'production', 'staging', 'test', 'dev', 'benchmarking'
- `clusters`
  - Table containing information about Postgres clusters
- `servers`
  - Table containing information about servers within a Postgres cluster
- `extensions`
  - The table stores information about Postgres extensions, including name, description, supported Postgres version range, and whether the extension is a contrib module or third-party.
  - 'postgres_min_version' and 'postgres_max_version' define the range of Postgres versions supported by extensions. If the postgres_max_version is NULL, it is assumed that the extension is still supported by new versions of Postgres.
- `operations`
  - Table containing logs of operations performed on cluster.
    - Note: The migration includes a DO block that checks for the presence of the timescaledb extension. If the extension is installed, the operations table is converted into a hypertable with monthly partitioning. Additionally, the block checks the timescaledb license. If the license is a Community license (timescale), a hypertable compression policy is created for partitions older than one month.
- `postgres_versions`
  - Table containing the major PostgreSQL versions supported by the autobase
- `settings`
  - Table containing configuration parameters, including console and other component settings

#### Views:

- `v_secrets_list`
  - Displays a list of secrets (without revealing secret values) along with additional metadata such as creation and update timestamps. It also includes information about whether each secret is in use and, if so, provides details on which clusters and servers are utilizing the secret.
- `v_operations`
  - Displays a list of operations, with additional columns such as the name of the cluster and environment.

#### Functions:

- `update_server_count`
  - Function to update the server_count column in the clusters table.
    - Note: This function calculates the number of servers associated with a specific cluster and updates the server_count accordingly. The trigger `update_server_count_trigger` is automatically executed whenever there are INSERT, UPDATE, or DELETE operations on the servers table. This ensures that the server_count in the clusters table is always accurate and up-to-date.
- `add_secret`
  - Function to add a secret.
    - Usage examples (project_id, secret_type, secret_name, secret_value, encryption_key):
      - `SELECT add_secret(1, 'ssh_key', '<NAME>', '{"private_key": "<CONTENT>"}', 'my_encryption_key');`
      - `SELECT add_secret(1, 'password', '<NAME>', '{"username": "<CONTENT>", "password": "<CONTENT>"}', 'my_encryption_key');`
      - `SELECT add_secret(1, 'cloud_secret', '<NAME>', '{"AWS_ACCESS_KEY_ID": "<CONTENT>", "AWS_SECRET_ACCESS_KEY": "<CONTENT>"}', 'my_encryption_key');`
- `update_secret`
  - Function to update a secret.
    - Usage example:
      - `SELECT update_secret(<secret_id>, '<new_secret_type>', '<new_secret_name>', '<new_secret_value>', '<encryption_key>');`
- `get_secret`
  - Function to get a secret value in JSON format.
    - Usage example (secret_id, encryption_key):
      - `SELECT get_secret(1, 'my_encryption_key');`
- `get_extensions`
  - Function to get a list of available extensions in JSON format. All or 'contrib'/'third_party' only (optional).
    - Usage examples:
      - `SELECT get_extensions(16);`
      - `SELECT get_extensions(16, 'contrib');`
      - `SELECT get_extensions(16, 'third_party');`
- `get_cluster_name`
  - Function to generate a unique name for a new PostgreSQL cluster.
    - Note: This function generates names in the format `postgres-cluster-XX`, where `XX` is a sequential number starting from 01. It checks the existing cluster names to ensure the generated name is unique.
  - Usage example:
    - `SELECT get_cluster_name();`
