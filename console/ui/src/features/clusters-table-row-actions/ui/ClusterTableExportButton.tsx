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

      // Convert extra_vars array of 'key=value' to object for vars
      const vars: Record<string, any> = {};
      (response.extra_vars || []).forEach(pair => {
        const [key, valueRaw] = pair.split('=', 2);
        let value: any = valueRaw;
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (!isNaN(Number(value))) value = Number(value);
        vars[key] = value;
      });

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

      const inventory = {
        all: {
          vars,
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
            balancers: { hosts: (vars.with_haproxy_load_balancing && Object.keys(balancerHosts).length) ? balancerHosts : {} },
          }
        }
      };

      // Convert to YAML and download
      const inventoryYAML = yaml.dump(inventory, { noRefs: true });
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