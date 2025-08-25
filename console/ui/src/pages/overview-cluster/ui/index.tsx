import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGetClustersByIdQuery } from '@shared/api/api/clusters.ts';
import { Grid } from '@mui/material';
import ClusterOverviewTable from '@widgets/cluster-overview-table';
import ConnectionInfo from '@entities/connection-info';
import ClusterInfo from '@entities/cluster-info';
import { useQueryPolling } from '@shared/lib/hooks.tsx';
import { CLUSTER_OVERVIEW_POLLING_INTERVAL } from '@shared/config/constants.ts';
import Spinner from '@shared/ui/spinner';

const OverviewCluster: FC = () => {
  const { t } = useTranslation('clusters');
  const { clusterId } = useParams();

  const cluster = useQueryPolling(() => useGetClustersByIdQuery({ id: clusterId }), CLUSTER_OVERVIEW_POLLING_INTERVAL);

  const connectionInfo = cluster.data?.connection_info;

  return cluster.isLoading ? (
    <Spinner />
  ) : (
    <Grid container spacing={2} padding={1}>
      <Grid item size={{ xs: 12 }}>
        <ClusterOverviewTable
          clusterName={cluster.data?.name}
          items={cluster.data?.servers ?? []}
          isLoading={cluster.isFetching}
          refetch={cluster.refetch}
        />
      </Grid>
      <Grid item size={{ xs: 6 }}>
        <ConnectionInfo connectionInfo={connectionInfo} />
      </Grid>
      <Grid item size={{ xs: 6 }}>
        <ClusterInfo
          postgresVersion={cluster.data?.postgres_version}
          clusterName={cluster.data?.name}
          description={cluster.data?.description}
          environment={cluster.data?.environment}
          location={cluster.data?.cluster_location}
        />
      </Grid>
    </Grid>
  );
};

export default OverviewCluster;
