import { FC } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ClustersTableRemoveButtonProps } from '@features/clusters-table-row-actions/model/types.ts';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useLazyGetClustersByIdQuery } from '@shared/api/api/clusters.ts';
import { toast } from 'react-toastify';
import { handleRequestErrorCatch } from '@shared/lib/functions.ts';

const ClustersTableExportButton: FC<ClustersTableRemoveButtonProps> = ({ clusterId, clusterName, closeMenu }) => {
  const { t } = useTranslation(['clusters', 'shared']);
  const [getClusterTrigger] = useLazyGetClustersByIdQuery();

  const handleButtonClick = async () => {
    try {
      const response = await getClusterTrigger({ id: clusterId }).unwrap();
      
      // Create inventory YAML content
      const inventory = {
        all: {
          vars: response.extra_vars,
          children: {
            balancers: {
              hosts: {}
            },
            etcd_cluster: {
              hosts: {}
            },
            master: {
              hosts: {}
            },
            replica: {
              hosts: {}
            },
            postgres_cluster: {
              children: {
                master: {},
                replica: {}
              }
            }
          }
        }
      };

      // Add servers to appropriate groups
      response.servers?.forEach(server => {
        const serverConfig = {
          hostname: server.server_name,
          postgresql_exists: true
        };

        // Add to etcd_cluster
        inventory.all.children.etcd_cluster.hosts[server.ip_address] = {};

        // Add to master or replica based on role
        if (server.server_role === 'leader') {
          inventory.all.children.master.hosts[server.ip_address] = serverConfig;
        } else {
          inventory.all.children.replica.hosts[server.ip_address] = serverConfig;
        }
      });

      // Add balancers if HAProxy is enabled
      if (response.extra_vars?.with_haproxy_load_balancing) {
        Object.assign(inventory.all.children.balancers.hosts, 
          inventory.all.children.master.hosts,
          inventory.all.children.replica.hosts
        );
      }

      // Convert to YAML and download
      const yamlContent = JSON.stringify(inventory, null, 2);
      const blob = new Blob([yamlContent], { type: 'text/yaml' });
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