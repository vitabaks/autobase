# Ansible Role: pgpass

Creates and manages the `~/.pgpass` file for the postgres user. The role ensures the target home directory exists, writes entries provided via variables, and enforces secure file permissions (0600).

## Role Variables

| Variable             | Type         | Default                                         | Description |
|----------------------|--------------|-------------------------------------------------|-------------|
| postgresql_pgpass    | list[string] | [...]                                              | Lines to write to ~/.pgpass. If empty/undefined, the role does nothing. Each line must follow hostname:port:database:username:password. |
| postgresql_home_dir  | string       | /var/lib/postgresql (Debian) or /var/lib/pgsql (RedHat) | Home directory where ~/.pgpass is created (owned by postgres). |

### Example

```yaml
postgresql_pgpass:
  - "localhost:{{ postgresql_port }}:*:{{ patroni_superuser_username }}:{{ patroni_superuser_password }}"
  - "{{ bind_address }}:{{ postgresql_port }}:*:{{ patroni_superuser_username }}:{{ patroni_superuser_password }}"
  - "*:{{ pgbouncer_listen_port }}:*:{{ patroni_superuser_username }}:{{ patroni_superuser_password }}"
```


## Dependencies

This role depends on:
- `vitabaks.autobase.common` - Provides common variables and configurations
