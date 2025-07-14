## Ansible Role: bind_address

This role automatically detects and sets the available private IPv4 address for each host as the variable `bind_address`, unless it is already defined in inventory or group_vars.

#### How it works
- Finds the first available private IPv4 address on the host (excluding the docker0 interface, if present).
- Sets this address as the Ansible fact bind_address using set_fact.
- If bind_address is already defined in inventory or variables, it will not be executed.
