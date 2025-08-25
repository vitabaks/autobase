import React, { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PAGINATION_LIMIT_OPTIONS } from '@shared/config/constants.ts';
import { MRT_ColumnDef, MRT_RowData, MRT_TableOptions } from 'material-react-table';
import { EnvironmentTableValues } from '@widgets/environments-table/model/types.ts';
import { environmentTableColumns } from '@widgets/environments-table/model/constants.ts';
import { useGetEnvironmentsTableData } from '@widgets/environments-table/lib/hooks.tsx';
import { useGetEnvironmentsQuery } from '@shared/api/api/environments.ts';
import EnvironmentsTableButtons from '@widgets/environments-table/ui/EnvironmentsTableButtons.tsx';
import EnvironmentsTableRowActions from '@features/environments-table-row-actions/ui';
import DefaultTable from '@shared/ui/default-table';
import RowActionsMenu from '@features/row-actions-menu/ui';

const EnvironmentsTable: FC = () => {
  const { t, i18n } = useTranslation(['settings', 'shared']);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGINATION_LIMIT_OPTIONS[1].value,
  });

  const environmentsList = useGetEnvironmentsQuery({
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
  });

  const columns = useMemo<MRT_ColumnDef<EnvironmentTableValues>[]>(() => environmentTableColumns(t), [i18n.language]);

  const data = useGetEnvironmentsTableData(environmentsList.data?.data);

  const tableConfig: MRT_TableOptions<MRT_RowData> = {
    columns,
    data,
    enablePagination: true,
    enableRowSelection: true,
    showGlobalFilter: true,
    enableRowActions: true,
    enableStickyHeader: true,
    enableMultiSort: false,
    enableSorting: false,
    onPaginationChange: setPagination,
    manualPagination: true,
    rowCount: environmentsList.data?.meta?.count ?? 0,
    state: {
      isLoading: environmentsList.isFetching,
      pagination,
    },
    renderRowActions: ({ row }) => <RowActionsMenu row={row} ActionsComponent={EnvironmentsTableRowActions} />,
  };

  return (
    <>
      <EnvironmentsTableButtons />
      <DefaultTable tableConfig={tableConfig} />
    </>
  );
};

export default EnvironmentsTable;
