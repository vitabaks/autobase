import { useMemo } from 'react';
import {
  CLUSTER_STATUSES,
  CLUSTER_TABLE_COLUMN_NAMES,
  clusterStatusColorNamesMap,
} from '@widgets/clusters-table/model/constants.ts';
import { CircularProgress, Link, Stack, Typography } from '@mui/material';
import { generateAbsoluteRouterPath } from '@shared/lib/functions.ts';
import RouterPaths from '@app/router/routerPathsConfig';
import { ClusterInfo } from '@shared/api/api/clusters.ts';
import { useLazyGetOperationsQuery } from '@shared/api/api/operations.ts';
import { selectCurrentProject } from '@app/redux/slices/projectSlice/projectSelectors.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { handleRequestErrorCatch } from '@shared/lib/functions.ts';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OPERATIONS_START_DATE = new Date(0).toISOString();

const FailedClusterStatusLink = ({ clusterName }: { clusterName: string }) => {
  const { t } = useTranslation('clusters');
  const navigate = useNavigate();
  const currentProject = useAppSelector(selectCurrentProject);
  const [getOperations, { isFetching }] = useLazyGetOperationsQuery();

  const handleClick = async () => {
    try {
      const response = await getOperations({
        projectId: Number(currentProject),
        clusterName,
        status: CLUSTER_STATUSES.FAILED,
        startDate: OPERATIONS_START_DATE,
        endDate: new Date().toISOString(),
        sortBy: '-id',
        limit: 1,
        offset: 0,
      }).unwrap();
      const operationId = response.data?.[0]?.id;

      if (operationId != null) {
        navigate(
          generateAbsoluteRouterPath(RouterPaths.operations.log.absolutePath, { operationId: String(operationId) }),
        );
      }
    } catch (error) {
      handleRequestErrorCatch(error);
    }
  };

  return (
    <Link component="button" type="button" onClick={handleClick} disabled={isFetching} title={t('showFailureLog')}>
      {CLUSTER_STATUSES.FAILED}
    </Link>
  );
};

export const useGetClustersTableData = (data: ClusterInfo[]) =>
  useMemo(
    () =>
      data?.map((cluster) => ({
        [CLUSTER_TABLE_COLUMN_NAMES.NAME]: [CLUSTER_STATUSES.DEPLOYING, CLUSTER_STATUSES.FAILED].some(
          (status) => status === cluster.status,
        ) ? (
          <Typography>{cluster.name}</Typography>
        ) : (
          <Link
            href={
              generateAbsoluteRouterPath(RouterPaths.clusters.overview.absolutePath, {
                clusterId: cluster.id,
              }).pathname
            }>
            {cluster.name}
          </Link>
        ),
        [CLUSTER_TABLE_COLUMN_NAMES.STATUS]: (
          <Stack direction="row" gap={1} alignItems="center">
            {cluster.status === CLUSTER_STATUSES.DEPLOYING ? (
              <CircularProgress size={14} />
            ) : clusterStatusColorNamesMap[cluster.status] ? (
              <img src={clusterStatusColorNamesMap[cluster.status]} alt={cluster.status} width="16px" />
            ) : null}
            {cluster.status === CLUSTER_STATUSES.FAILED ? (
              <FailedClusterStatusLink clusterName={cluster.name ?? ''} />
            ) : (
              <Typography>{cluster.status}</Typography>
            )}
          </Stack>
        ),
        [CLUSTER_TABLE_COLUMN_NAMES.CREATION_TIME]: cluster.creation_time,
        [CLUSTER_TABLE_COLUMN_NAMES.ENVIRONMENT]: cluster.environment,
        [CLUSTER_TABLE_COLUMN_NAMES.SERVERS]: cluster.servers?.length ?? '-',
        [CLUSTER_TABLE_COLUMN_NAMES.POSTGRES_VERSION]: cluster?.postgres_version ?? '-',
        [CLUSTER_TABLE_COLUMN_NAMES.LOCATION]: cluster?.cluster_location ?? '-',
        [CLUSTER_TABLE_COLUMN_NAMES.ID]: cluster.id, // not displayed, required only for correct cluster removal
      })) ?? [],
    [data],
  );
