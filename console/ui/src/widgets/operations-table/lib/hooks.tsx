import { useMemo } from 'react';
import { OPERATIONS_TABLE_COLUMN_NAMES } from '@widgets/operations-table/model/constants.ts';
import { ResponseOperation } from '@shared/api/api/operations.ts';

export const useGetOperationsTableData = (data: ResponseOperation[]) =>
  useMemo(
    () =>
      data?.map((operation) => ({
        [OPERATIONS_TABLE_COLUMN_NAMES.ID]: operation.id!,
        [OPERATIONS_TABLE_COLUMN_NAMES.CLUSTER]: operation.cluster_name!,
        [OPERATIONS_TABLE_COLUMN_NAMES.STARTED]: operation.started,
        [OPERATIONS_TABLE_COLUMN_NAMES.FINISHED]: operation.status === 'in_progress' ? '-' : operation?.finished ?? '-',
        [OPERATIONS_TABLE_COLUMN_NAMES.TYPE]: operation.type!,
        [OPERATIONS_TABLE_COLUMN_NAMES.STATUS]: operation.status!,
        [OPERATIONS_TABLE_COLUMN_NAMES.ENVIRONMENT]: operation.environment!,
      })) ?? [],
    [data],
  );
