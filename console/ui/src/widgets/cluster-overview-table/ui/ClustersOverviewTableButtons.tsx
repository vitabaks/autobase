import { FC } from 'react';
import { Stack } from '@mui/material';
import { usePostClustersByIdRefreshMutation } from '@shared/api/api/clusters.ts';
import { useParams } from 'react-router-dom';
import RefreshGroup from '@features/refresh-group';

const ClustersOverviewTableButtons: FC = () => {
  const { clusterId } = useParams();

  const [refreshClusterTrigger] = usePostClustersByIdRefreshMutation();

  const handleRefresh = () => {
    void refreshClusterTrigger({ id: Number(clusterId) });
  };

  return (
    <Stack direction="row" justifyContent="flex-end" alignItems="center" gap="8px">
      <RefreshGroup context="clusterOverview" onRefresh={handleRefresh} />
    </Stack>
  );
};

export default ClustersOverviewTableButtons;
