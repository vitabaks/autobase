import { createMRTColumnHelper } from 'material-react-table';
import { TFunction } from 'i18next';
import { ClusterOverviewTableValues } from '@widgets/cluster-overview-table/model/types.ts';

export const CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES = Object.freeze({
  NAME: 'name',
  HOST: 'host',
  PUBLIC_IP: 'publicIp',
  ROLE: 'role',
  STATE: 'state',
  TIMELINE: 'timeline',
  LAG_IN_MB: 'lagInMb',
  PENDING_RESTART: 'pendingRestart',
  TAGS: 'tags',
  ID: 'id',
});

const columnHelper = createMRTColumnHelper<ClusterOverviewTableValues>();

export const clusterOverviewTableColumns = (t: TFunction) => [
  columnHelper.accessor(CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.NAME, {
    header: t('name', { ns: 'shared' }),
  }),
  columnHelper.accessor(CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.HOST, {
    header: t('privateIp', { ns: 'clusters' }),
    size: 120,
  }),
  columnHelper.accessor(CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.PUBLIC_IP, {
    header: t('publicIp', { ns: 'clusters' }),
    size: 120,
  }),
  columnHelper.accessor(CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.ROLE, {
    header: t('role', { ns: 'clusters' }),
    size: 120,
  }),
  columnHelper.accessor(CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.STATE, {
    header: t('state', { ns: 'clusters' }),
    size: 110,
  }),
  columnHelper.accessor(CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.TIMELINE, {
    header: t('timeline', { ns: 'clusters' }),
    size: 80,
  }),
  columnHelper.accessor(CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.LAG_IN_MB, {
    header: t('lagInMb', { ns: 'clusters' }),
    size: 140,
  }),
  columnHelper.accessor(CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.PENDING_RESTART, {
    header: t('pendingRestart', { ns: 'clusters' }),
  }),
  columnHelper.accessor(CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.TAGS, {
    header: t('tags', { ns: 'clusters' }),
  }),
];
