import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef, MRT_RowData, MRT_TableOptions } from 'material-react-table';
import { SecretsTableValues } from '@widgets/secrets-table/model/types.ts';
import SettingsTableRowActions from '@features/settings-table-row-actions';
import SettingsTableButtons from '@features/settings-table-buttons';
import { useGetSecretsQuery } from '@shared/api/api/secrets.ts';
import { PAGINATION_LIMIT_OPTIONS } from '@shared/config/constants.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectCurrentProject } from '@app/redux/slices/projectSlice/projectSelectors.ts';
import { secretsTableColumns } from '@widgets/secrets-table/model/constants.ts';

import { useGetSecretsTableData } from '@widgets/secrets-table/lib/hooks.tsx';
import DefaultTable from '@shared/ui/default-table';
import RowActionsMenu from '@features/row-actions-menu/ui';

const SecretsTable: React.FC = () => {
  const { t, i18n } = useTranslation(['settings', 'shared']);

  const currentProject = useAppSelector(selectCurrentProject);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGINATION_LIMIT_OPTIONS[1].value,
  });

  const secretsList = useGetSecretsQuery({
    projectId: Number(currentProject),
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
  });

  const columns = useMemo<MRT_ColumnDef<SecretsTableValues>[]>(() => secretsTableColumns(t), [i18n.language]);

  const data = useGetSecretsTableData(secretsList.data?.data);

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
    rowCount: secretsList.data?.meta?.count ?? 0,
    state: {
      isLoading: secretsList.isFetching,
      pagination,
    },
    renderRowActions: ({ row }) => <RowActionsMenu row={row} ActionsComponent={SettingsTableRowActions} />,
  };

  return (
    <>
      <SettingsTableButtons />
      <DefaultTable tableConfig={tableConfig} />
    </>
  );
};

export default SecretsTable;
