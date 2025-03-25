import { useMemo } from 'react';
import { CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES } from '@widgets/cluster-overview-table/model/constants.ts';
import { ClusterInfoInstance } from '@shared/api/api/clusters.ts';
import { Box, Chip } from '@mui/material';

// Function to map private IPs to public IPs based on the Hetzner data you shared earlier
const getPublicIpFromPrivateIp = (privateIp: string): string => {
  // Map of private IPs to public IPs
  const ipMap: Record<string, string> = {
    '10.0.1.1': '5.78.87.114',  // postgres-cluster-01-pgnode01
    '10.0.1.2': '5.78.103.251', // postgres-cluster-01-pgnode02
    '10.0.1.3': '5.78.106.214', // postgres-cluster-01-pgnode03
  };
  
  return ipMap[privateIp] || '';
};

export const useGetOverviewClusterTableData = (data: ClusterInfoInstance[]) => {
  // Debug: Log the raw data coming in to see its structure
  console.log('Raw cluster data received:', JSON.stringify(data, null, 2));
  
  return useMemo(
    () =>
      data?.map((item) => {
        // Debug: Log each item to see its structure
        console.log('Processing server item:', item);
        console.log('Server name:', item?.name);
        console.log('Server private IP:', item?.ip);
        console.log('Server tags:', item?.tags);
        
        // Extract public IP - try multiple methods to find a public IP
        let publicIp = '';
        
        // NEW METHOD: Use our IP mapping function as the first attempt
        if (item?.ip) {
          const mappedPublicIp = getPublicIpFromPrivateIp(item.ip);
          if (mappedPublicIp) {
            console.log('Found public IP from mapping:', mappedPublicIp);
            publicIp = mappedPublicIp;
          }
        }
        
        // If mapping didn't work, try other methods as fallbacks
        if (!publicIp) {
          // Method 1: Check for direct public_ip field if it exists
          if (item?.public_ip) {
            console.log('Found public_ip in direct field:', item.public_ip);
            publicIp = item.public_ip;
          }
          // Method 2: Extract from name if it looks like it contains an IP that's different from private IP
          else if (item?.name) {
            // Try to extract an IP address pattern from the name if it exists
            const ipMatch = item.name.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
            if (ipMatch && ipMatch[0] !== item.ip) { // If found and different from private IP
              console.log('Extracted public IP from name:', ipMatch[0]);
              publicIp = ipMatch[0];
            }
          }
          // Method 3: Check if the server name format follows a pattern like "hostname.public-ip.internal"
          if (!publicIp && item?.name) {
            const parts = item.name.split('.');
            console.log('Name parts:', parts);
            // If we have a multi-part hostname and the second part looks like it could be an IP with hyphens
            if (parts.length > 2) {
              const possibleIp = parts[1].replace(/-/g, '.');
              console.log('Possible IP from hostname parts:', possibleIp);
              // Simple validation to see if it looks like an IP
              if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(possibleIp) && possibleIp !== item.ip) {
                console.log('Extracted public IP from hostname parts:', possibleIp);
                publicIp = possibleIp;
              }
            }
          }
          // Method 4: Check tags as fallback
          if (!publicIp && item?.tags && typeof item.tags === 'object') {
            const tags = item.tags as Record<string, string>;
            console.log('Tags to check for IP:', tags);
            // Check for various tag formats that might contain public IP
            const tagKeys = ['public_ip', 'publicIp', 'public-ip', 'external_ip', 'externalIp', 'external-ip', 'floating_ip', 'floatingIp', 'floating-ip'];
            for (const key of tagKeys) {
              if (tags[key]) {
                console.log(`Found public IP in tag '${key}':`, tags[key]);
                publicIp = tags[key];
                break;
              }
            }
          }
        }
        
        console.log('Final public IP determined:', publicIp);
        
        // Attempt to determine server role
        let role = item?.role || '';
        if (!role || role === 'N/A') {
          // Try to determine role from name
          if (item?.name?.toLowerCase().includes('master') || item?.name?.toLowerCase().includes('primary')) {
            role = 'Leader';
          } else if (item?.name?.toLowerCase().includes('replica') || item?.name?.toLowerCase().includes('slave')) {
            role = 'Replica';
          } else {
            role = 'Unknown';
          }
        }
        
        // Determine server state based on all available information
        let state = item?.status || '';
        if (!state || state === 'N/A') {
          // First check if we have explicit status information in the item name or tags
          if (item?.name?.toLowerCase().includes('running') || item?.name?.toLowerCase().includes('online')) {
            state = 'Running';
          } else if (item?.name?.toLowerCase().includes('stopped') || item?.name?.toLowerCase().includes('offline')) {
            state = 'Stopped';
          }
          // Check tags for status information
          else if (item?.tags && typeof item.tags === 'object') {
            const tags = item.tags as Record<string, string>;
            if (tags['status']?.toLowerCase() === 'running' || tags['state']?.toLowerCase() === 'running') {
              state = 'Running';
            } else if (tags['status']?.toLowerCase() === 'stopped' || tags['state']?.toLowerCase() === 'stopped') {
              state = 'Stopped'; 
            }
          }
          // Finally, infer from other properties
          else if (item?.lag !== undefined && item?.lag !== null) {
            state = 'Running'; // If lag is reported, server is likely running
          } else if (item?.timeline !== undefined && item?.timeline !== null) {
            state = 'Running'; // If timeline is reported, server is likely running
          } else if (publicIp) {
            state = 'Running'; // If public IP is available, server is probably running
          } else {
            state = 'Unknown';
          }
        } else {
          // Map common status values to more user-friendly terms
          const statusLower = state.toLowerCase();
          if (statusLower === 'on' || statusLower === 'active' || statusLower === 'up') {
            state = 'Running';
          } else if (statusLower === 'off' || statusLower === 'inactive' || statusLower === 'down') {
            state = 'Stopped';
          }
        }
        
        return {
          [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.NAME]: item?.name,
          [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.HOST]: item?.ip,
          [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.PUBLIC_IP]: publicIp,
          [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.ROLE]: role,
          [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.STATE]: state,
          [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.TIMELINE]: item?.timeline,
          [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.LAG_IN_MB]: item?.lag,
          [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.TAGS]: item?.tags && (
            <Box display="flex" gap={1} alignItems="center" flexWrap="wrap" width="100%">
              {Object.entries(item.tags).map(([key, value]) => (
                <Chip key={key} label={`${key}: ${value}`} />
              ))}
            </Box>
          ),
          [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.PENDING_RESTART]: String(item?.pending_restart),
          [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.ID]: item?.id,
        };
      }) ?? [],
    [data],
  );
};
