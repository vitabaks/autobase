import { TFunction } from 'i18next';
import { createMRTColumnHelper } from 'material-react-table';
import { OperationsTableValues } from '@widgets/operations-table/model/types.ts';
import { convertTimestampToReadableTime } from '@shared/lib/functions.ts';

export const OPERATIONS_TABLE_COLUMN_NAMES = Object.freeze({
  // names are used as sorting params, changes will break sorting
  ID: 'id',
  STARTED: 'started',
  FINISHED: 'finished',
  TYPE: 'type',
  STATUS: 'status',
  CLUSTER: 'cluster_name',
  ENVIRONMENT: 'environment',
  ACTIONS: 'actions',
});

const columnHelper = createMRTColumnHelper<OperationsTableValues>();

export const operationTableColumns = (t: TFunction) => [
  columnHelper.accessor(OPERATIONS_TABLE_COLUMN_NAMES.ID, {
    header: t('id', { ns: 'shared' }),
    size: 80,
    grow: true,
    visibleInShowHideMenu: false,
  }),
  columnHelper.accessor(OPERATIONS_TABLE_COLUMN_NAMES.STARTED, {
    header: t('started', { ns: 'operations' }),
    grow: true,
    size: 120,
    Cell: ({ cell }) => convertTimestampToReadableTime(cell.getValue()),
  }),
  columnHelper.accessor(OPERATIONS_TABLE_COLUMN_NAMES.FINISHED, {
    header: t('finished', { ns: 'operations' }),
    grow: true,
    size: 120,
    Cell: ({ cell }) => convertTimestampToReadableTime(cell.getValue()),
  }),
  columnHelper.accessor(OPERATIONS_TABLE_COLUMN_NAMES.TYPE, {
    header: t('type', { ns: 'operations' }),
    grow: true,
    size: 60,
  }),
  columnHelper.accessor(OPERATIONS_TABLE_COLUMN_NAMES.STATUS, {
    header: t('status', { ns: 'shared' }),
    grow: true,
    size: 80,
  }),
  columnHelper.accessor(OPERATIONS_TABLE_COLUMN_NAMES.CLUSTER, {
    header: t('cluster', { ns: 'clusters' }),
    grow: true,
    size: 140,
  }),
  columnHelper.accessor(OPERATIONS_TABLE_COLUMN_NAMES.ENVIRONMENT, {
    header: t('environment', { ns: 'shared' }),
    grow: true,
    size: 140,
  }),
];
