import { useMemo } from 'react';
import { CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES } from '@widgets/cluster-overview-table/model/constants.ts';
import { ClusterInfoInstance } from '@shared/api/api/clusters.ts';
import { Box, Chip } from '@mui/material';

export const useGetOverviewClusterTableData = (data: ClusterInfoInstance[]) => {
  return useMemo(
    () =>
      data?.map((item) => ({
        [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.NAME]: item?.name,
        [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.HOST]: item?.ip,
        [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.ROLE]: item?.role,
        [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.STATE]: item?.status,
        [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.TIMELINE]: item?.timeline,
        [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.LAG]: item?.lag,
        [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.TAGS]: item?.tags && (
          <Box display="flex" gap={1} alignItems="center" flexWrap="wrap" width="100%">
            {Object.entries(item.tags).map(([key, value]) => (
              <Chip key={key} label={`${key}: ${value}`} />
            ))}
          </Box>
        ),
        [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.PENDING_RESTART]: String(item?.pending_restart),
        [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.ID]: item?.id,
      })) ?? [],
    [data],
  );
};
