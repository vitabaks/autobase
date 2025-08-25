import { FC, useMemo, useState } from 'react';
import { MRT_ColumnDef, MRT_RowData, MRT_TableOptions } from 'material-react-table';
import { OPERATIONS_TABLE_COLUMN_NAMES, operationTableColumns } from '@widgets/operations-table/model/constants.ts';
import { useTranslation } from 'react-i18next';
import { OperationsTableValues } from '@widgets/operations-table/model/types.ts';
import OperationsTableButtons from '@features/operations-table-buttons';
import OperationsTableRowActions from '@features/operations-table-row-actions';
import { useGetOperationsQuery } from '@shared/api/api/operations.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectCurrentProject } from '@app/redux/slices/projectSlice/projectSelectors.ts';
import { subDays } from 'date-fns/subDays';
import {
  formatOperationsDate,
  getOperationsDateRangeVariants,
} from '@features/operations-table-buttons/lib/functions.ts';
import { OPERATIONS_POLLING_INTERVAL, PAGINATION_LIMIT_OPTIONS } from '@shared/config/constants.ts';
import { useGetOperationsTableData } from '@widgets/operations-table/lib/hooks.tsx';
import { manageSortingOrder } from '@shared/lib/functions.ts';
import { useQueryPolling } from '@shared/lib/hooks.tsx';
import DefaultTable from '@shared/ui/default-table';
import RowActionsMenu from '@features/row-actions-menu/ui';

const OperationsTable: FC = () => {
  const { t, i18n } = useTranslation(['operations', 'shared']);

  const currentProject = useAppSelector(selectCurrentProject);

  const [sorting, setSorting] = useState([
    {
      id: OPERATIONS_TABLE_COLUMN_NAMES.ID,
      desc: true,
    },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGINATION_LIMIT_OPTIONS[1].value,
  });

  const [endDate] = useState(new Date().toISOString());
  const [startDate, setStartDate] = useState({
    name: getOperationsDateRangeVariants(t)[0].value,
    value: formatOperationsDate(subDays(new Date(), 1)),
  });

  const operationsList = useQueryPolling(
    () =>
      useGetOperationsQuery({
        projectId: Number(currentProject),
        startDate: startDate.value,
        endDate,
        offset: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
        ...(sorting?.[0] ? { sortBy: manageSortingOrder(sorting[0]) } : {}),
      }),
    OPERATIONS_POLLING_INTERVAL,
  );

  const columns = useMemo<MRT_ColumnDef<OperationsTableValues>[]>(() => operationTableColumns(t), [i18n.language]);

  const data = useGetOperationsTableData(operationsList.data?.data);

  const tableConfig: MRT_TableOptions<MRT_RowData> = {
    columns,
    data,
    enablePagination: true,
    showGlobalFilter: true,
    manualSorting: true,
    manualPagination: true,
    enableRowActions: true,
    enableStickyHeader: true,
    enableMultiSort: false,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: operationsList.data?.meta?.count ?? 0,
    state: {
      isLoading: operationsList.isFetching,
      pagination,
      sorting,
    },
    renderRowActions: ({ row }) => <RowActionsMenu row={row} ActionsComponent={OperationsTableRowActions} />,
  };

  return (
    <>
      <OperationsTableButtons refetch={operationsList.refetch} startDate={startDate} setStartDate={setStartDate} />
      <DefaultTable tableConfig={tableConfig} />
    </>
  );
};

export default OperationsTable;
