import { FC } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ClustersTableRemoveButtonProps } from '@features/clusters-table-row-actions/model/types.ts';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useLazyGetClustersByIdQuery } from '@shared/api/api/clusters.ts';
import { toast } from 'react-toastify';
import { handleRequestErrorCatch } from '@shared/lib/functions.ts';
import yaml from 'js-yaml';

const ClustersTableExportButton: FC<ClustersTableRemoveButtonProps> = ({ clusterId, clusterName, closeMenu }) => {
  const { t } = useTranslation(['clusters', 'shared']);
  const [getClusterTrigger] = useLazyGetClustersByIdQuery();

  const handleButtonClick = async () => {
    try {
      const response = await getClusterTrigger({ id: clusterId }).unwrap();

      // extra_vars parsing
      let vars: Record<string, any> = {};
      if (typeof response.extra_vars === 'string' && response.extra_vars.trim() !== '') {
        try {
          vars = JSON.parse(response.extra_vars);
        } catch (e) {
        }
      } else if (response.extra_vars && typeof response.extra_vars === 'object') {
        vars = response.extra_vars as Record<string, any>;
      }

      // Only include valid servers (with ip and name)
      const validServers = (response.servers || []).filter(
        server => server.ip && server.name &&
          server.ip !== 'undefined' && server.name !== 'undefined' &&
          server.ip !== null && server.name !== null &&
          server.ip !== '' && server.name !== ''
      );

      // Prepare host groups
      const masterHosts: Record<string, any> = {};
      const replicaHosts: Record<string, any> = {};
      const etcdHosts: Record<string, any> = {};
      const balancerHosts: Record<string, any> = {};

      validServers.forEach(server => {
        // Host details for master/replica
        const hostData: Record<string, any> = {
          hostname: server.name,
          ansible_host: server.ip,
          postgresql_exists: true,
        };
        if (server.location) hostData.server_location = server.location;
        if (server.role === 'leader' || server.role === 'master' || server.role === 'primary') {
          masterHosts[server.ip] = hostData;
        } else {
          replicaHosts[server.ip] = hostData;
        }
        // etcd_cluster: only ansible_host
        etcdHosts[server.ip] = { ansible_host: server.ip };
        // balancers: only ansible_host, only if enabled
        if (vars.with_haproxy_load_balancing) {
          balancerHosts[server.ip] = { ansible_host: server.ip };
        }
      });

      // Special handling for ssh_public_keys:
      // always export as array of single-line strings, no extra quotes, preserve all characters
      if (typeof vars.ssh_public_keys === 'string') {
        let keyStr = vars.ssh_public_keys.trim().replace(/^'+|'+$/g, '').replace(/\s+/g, ' ');
        vars.ssh_public_keys = [keyStr];
      } else if (Array.isArray(vars.ssh_public_keys)) {
        vars.ssh_public_keys = vars.ssh_public_keys
          .map(k =>
            typeof k === 'string'
              ? k.trim().replace(/^'+|'+$/g, '').replace(/\s+/g, ' ')
              : k
          )
          .filter(k => typeof k === 'string' && k.length > 0);
      }

      // Sorting vars by key in alphabetical order before exporting
      const sortedVars: Record<string, any> = Object.keys(vars)
        .sort((a, b) => a.localeCompare(b))
        .reduce((acc, key) => {
          acc[key] = vars[key];
          return acc;
        }, {} as Record<string, any>);

      // Force js-yaml to use plain style for ssh_public_keys (no quotes, no block/literal)
      const yamlOptions = {
        noRefs: true,
        lineWidth: -1,
        styles: {
          '!!str': () => undefined
        }
      };

      const inventory = {
        all: {
          vars: sortedVars,
          children: {
            master: { hosts: Object.keys(masterHosts).length ? masterHosts : {} },
            replica: { hosts: Object.keys(replicaHosts).length ? replicaHosts : {} },
            postgres_cluster: {
              children: {
                master: {},
                replica: {},
              }
            },
            etcd_cluster: { hosts: Object.keys(etcdHosts).length ? etcdHosts : {} },
            balancers: { hosts: (sortedVars.with_haproxy_load_balancing && Object.keys(balancerHosts).length) ? balancerHosts : {} },
          }
        }
      };

      // Convert to YAML and download
      const inventoryYAML = yaml.dump(inventory, yamlOptions);
      const blob = new Blob([inventoryYAML], { type: 'text/yaml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${clusterName}-inventory.yaml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(t('clusterSuccessfullyExported', { ns: 'toasts', clusterName }));
    } catch (e) {
      handleRequestErrorCatch(e);
    } finally {
      closeMenu();
    }
  };

  return (
    <Button sx={{ textTransform: 'none', color: 'text.primary' }} onClick={handleButtonClick} variant="text">
      <Stack direction="row" alignItems="center" justifyContent="flex-start" width="max-content">
        <FileDownloadIcon />
        <Typography>{t('exportToInventory', { ns: 'shared' })}</Typography>
      </Stack>
    </Button>
  );
};

export default ClustersTableExportButton;
