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

  const parseVariableValue = (valueRaw: string): any => {
    // Handle boolean values
    if (valueRaw === 'true') return true;
    if (valueRaw === 'false') return false;
    
    // Handle numeric values
    if (!isNaN(Number(valueRaw)) && valueRaw !== '') {
      return Number(valueRaw);
    }
    
    // Handle JSON structures (objects and arrays)
    if (valueRaw.startsWith('{') || valueRaw.startsWith('[')) {
      try {
        // First try to parse as valid JSON
        return JSON.parse(valueRaw);
      } catch (e) {
        // If JSON parsing fails, try to fix common issues
        try {
          let fixedValue = valueRaw;
          
          if (valueRaw.startsWith('{')) {
            // Fix object notation: {key:value} -> {"key":"value"}
            // Handle unquoted keys and values
            fixedValue = valueRaw
              .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')  // Quote keys
              .replace(/:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*([,}])/g, ':"$1"$2')   // Quote string values
              .replace(/:\s*(\d+)\s*([,}])/g, ':$1$2');                        // Keep numeric values unquoted
          } else if (valueRaw.startsWith('[')) {
            // Fix array notation: ensure proper JSON format
            // Handle arrays of strings that might not be properly quoted
            fixedValue = valueRaw
              .replace(/\[\s*"([^"]+)"\s*(?:,\s*"([^"]+)"\s*)*\]/g, (match) => {
                // Already properly quoted, return as is
                return match;
              })
              .replace(/\[\s*([^"\[{][^,\]]*)\s*(?:,\s*([^"\[{][^,\]]*)\s*)*\]/g, (match) => {
                // Fix unquoted string arrays
                return match.replace(/([^",\[\]{}]+)/g, (item) => {
                  const trimmed = item.trim();
                  if (trimmed && !trimmed.startsWith('"') && !trimmed.endsWith('"') && isNaN(Number(trimmed))) {
                    return `"${trimmed}"`;
                  }
                  return item;
                });
              });
          }
          
          return JSON.parse(fixedValue);
        } catch (e2) {
          // If all parsing attempts fail, return as string
          return valueRaw;
        }
      }
    }
    
    // Return as string if no special processing needed
    return valueRaw;
  };

  const handleButtonClick = async () => {
    try {
      const response = await getClusterTrigger({ id: clusterId }).unwrap();

      // Convert extra_vars array of 'key=value' to object for vars
      const vars: Record<string, any> = {};
      (response.extra_vars || []).forEach(pair => {
        // Split only at the first '='
        const eqIdx = pair.indexOf('=');
        if (eqIdx !== -1) {
          const key = pair.slice(0, eqIdx);
          const valueRaw = pair.slice(eqIdx + 1);
          vars[key] = parseVariableValue(valueRaw);
        }
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