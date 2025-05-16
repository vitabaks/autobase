# Ansible Role: common

This role serves as a centralized place to define default variables shared across other roles in the collection.

## Purpose

- Store `defaults/main.yml` with shared variables used by multiple roles.
- Ensure predictable behavior by centralizing defaults in one location.

## Usage Notes

- This role must be listed as a dependency in other roles via `meta/main.yml`:
  ```yaml
  dependencies:
    - role: vitabaks.autobase.common
  ```

- Variables defined in `roles/common/defaults/main.yml` have the lowest precedence  
  (as per [Ansible’s variable precedence rules](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#understanding-variable-precedence)):
  - They will be overridden by any value defined in the dependent role’s `defaults`, `vars`, `group_vars`, `host_vars`, etc.
- To redefine the value of a variable, copy it to `group_vars` or another suitable location.

## Important Guidelines

- Do not redefine variables in the `defaults/` directory of dependent roles if they already exist in `common/defaults`.  Instead, comment them out or remove them to avoid duplication and priority conflicts. Example:

  ```yaml
    # Defined in roles/common/defaults/main.yml. Commented out here to prevent conflicts.
    # mount:
    #  - path: ""
    #    src: ""
    #    fstype: ""
    #    opts: ""
    #    state: ""
  ```

- Variables from `common/defaults` are not available during playbook parsing. This affects conditional expressions such as `when:`
  - To avoid errors, always wrap such conditions in a `default` filter:

    ```yaml
    when: tls_cert_generate | default(true) | bool
    ```

  - If a variable from `common` must be available during playbook parsing (e.g. used in 'when'), define it in `group_vars` or another appropriate location.

