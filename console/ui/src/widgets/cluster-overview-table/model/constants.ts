import { createMRTColumnHelper } from 'material-react-table';
import { TFunction } from 'i18next';
import { ClusterOverviewTableValues } from '@widgets/cluster-overview-table/model/types.ts';
import { formatBytes } from '@shared/lib/formatBytes.ts';

export const CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES = Object.freeze({
  NAME: 'name',
  HOST: 'host',
  ROLE: 'role',
  STATE: 'state',
  TIMELINE: 'timeline',
  LAG: 'lag',
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
    header: t('host', { ns: 'clusters' }),
    size: 70,
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
  columnHelper.accessor(CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.LAG, {
    header: t('lag', { ns: 'clusters' }),
    Cell: ({ cell }) => formatBytes(cell.getValue()),
    size: 140,
  }),
  columnHelper.accessor(CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.PENDING_RESTART, {
    header: t('pendingRestart', { ns: 'clusters' }),
  }),
  columnHelper.accessor(CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.TAGS, {
    header: t('tags', { ns: 'clusters' }),
  }),
];
