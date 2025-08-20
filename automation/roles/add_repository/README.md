# Ansible Role: add_repository

This role manages repository configuration for PostgreSQL and other packages.

## PostgreSQL Repository Extras

To enable the PostgreSQL extras repository (e.g., `pgdg-rhel8-extras`) for additional packages like HAProxy:

```yaml
install_postgresql_repo: true
install_postgresql_repo_extras: true  # Enables pgdg-rhel<version>-extras
```
