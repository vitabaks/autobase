// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

describe('getLocalMachineEnvs', () => {
  it('maps per-host ssh port to ansible_ssh_port', async () => {
    localStorage.setItem('isExpertMode', 'false');
    vi.resetModules();

    const { getLocalMachineEnvs } = await import('@shared/lib/clusterValuesTransformFunctions.ts');

    const values = {
      authenticationMethod: 'ssh_key',
      isUseDefinedSecret: false,
      USERNAME: 'root',
      databaseServerExistingCluster: false,
      databaseServers: [
        {
          databaseServerHostname: 'db-1',
          databaseServerIpAddress: '10.0.0.1',
          databaseServerSshPort: '2222',
          databaseServerLocation: 'dc-1',
        },
        {
          databaseServerHostname: 'db-2',
          databaseServerIpAddress: '10.0.0.2',
          databaseServerSshPort: '2202',
          databaseServerLocation: 'dc-2',
        },
      ],
    };

    const envs = getLocalMachineEnvs(values as never);
    const inventory = envs.ANSIBLE_INVENTORY_JSON.all.children;

    expect(inventory.master.hosts['10.0.0.1'].ansible_ssh_port).toBe('2222');
    expect(inventory.replica.hosts['10.0.0.2'].ansible_ssh_port).toBe('2202');
    expect(inventory.etcd_cluster.hosts['10.0.0.1'].ansible_ssh_port).toBe('2222');
    expect(inventory.etcd_cluster.hosts['10.0.0.2'].ansible_ssh_port).toBe('2202');
  });

  it('maps dcs and load balancer ssh port to ansible_ssh_port in expert mode', async () => {
    localStorage.setItem('isExpertMode', 'true');
    vi.resetModules();

    const { getLocalMachineEnvs } = await import('@shared/lib/clusterValuesTransformFunctions.ts');

    const values = {
      authenticationMethod: 'ssh_key',
      isUseDefinedSecret: false,
      USERNAME: 'root',
      databaseServerExistingCluster: false,
      isHaproxyEnabled: true,
      isDeployToDatabaseServers: false,
      loadBalancerDatabases: [
        {
          loadBalancerDatabasesHostname: 'lb-1',
          loadBalancerDatabasesIpAddress: '10.0.1.1',
          loadBalancerDatabasesSshPort: '2244',
        },
      ],
      type: 'etcd',
      isDeployNewCluster: true,
      isDeployToDbServers: false,
      dcsDatabases: [
        {
          dcsDatabaseHostname: 'dcs-1',
          dcsDatabaseIpAddress: '10.0.2.1',
          dcsDatabaseSshPort: '2233',
          dcsDatabasePort: '2379',
        },
      ],
      databaseServers: [
        {
          databaseServerHostname: 'db-1',
          databaseServerIpAddress: '10.0.0.1',
          databaseServerSshPort: '2222',
          databaseServerLocation: 'dc-1',
        },
      ],
    };

    const envs = getLocalMachineEnvs(values as never);
    const inventory = envs.ANSIBLE_INVENTORY_JSON.all.children;

    expect(inventory.etcd_cluster.hosts['10.0.2.1'].ansible_ssh_port).toBe('2233');
    expect(inventory.balancers.hosts['10.0.1.1'].ansible_ssh_port).toBe('2244');
  });
});
