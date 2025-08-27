import { FC, useMemo, useState } from 'react';
import { CLUSTER_TABLE_COLUMN_NAMES } from '@widgets/clusters-table/model/constants.ts';
import { useTranslation } from 'react-i18next';
import { ClustersTableValues } from '@widgets/clusters-table/model/types.ts';
import { MRT_ColumnDef, MRT_RowData, MRT_TableOptions } from 'material-react-table';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectCurrentProject } from '@app/redux/slices/projectSlice/projectSelectors.ts';
import { CLUSTERS_POLLING_INTERVAL, PAGINATION_LIMIT_OPTIONS } from '@shared/config/constants.ts';
import ClustersTableButtons from '@features/clusters-table-buttons';
import { useGetClustersQuery } from '@shared/api/api/clusters.ts';
import { useGetClustersTableData } from '@widgets/clusters-table/lib/hooks.tsx';
import { useGetEnvironmentsQuery } from '@shared/api/api/environments.ts';
import { useGetPostgresVersionsQuery } from '@shared/api/api/other.ts';
import ClustersTableRowActions from '@features/clusters-table-row-actions';
import ClustersEmptyRowsFallback from '@widgets/clusters-table/ui/ClustersEmptyRowsFallback.tsx';
import { getClusterTableColumns } from '@widgets/clusters-table/lib/functions.ts';
import { manageSortingOrder } from '@shared/lib/functions.ts';
import { useQueryPolling } from '@shared/lib/hooks.tsx';
import DefaultTable from '@shared/ui/default-table';
import RowActionsMenu from '@features/row-actions-menu/ui';

const ClustersTable: FC = () => {
  const { t, i18n } = useTranslation('clusters');

  const currentProject = useAppSelector(selectCurrentProject);

  const [sorting, setSorting] = useState([
    {
      id: CLUSTER_TABLE_COLUMN_NAMES.CREATION_TIME,
      desc: true,
    },
  ]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGINATION_LIMIT_OPTIONS[1].value,
  });

  const environments = useGetEnvironmentsQuery({ offset: 0, limit: 999_999_999 });
  const postgresVersions = useGetPostgresVersionsQuery();

  const clustersList = useQueryPolling(
    () =>
      useGetClustersQuery({
        projectId: Number(currentProject), // TODO: projectId, projectCode
        offset: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
        ...(sorting?.[0] ? { sortBy: manageSortingOrder(sorting[0]) } : {}),
      }),
    CLUSTERS_POLLING_INTERVAL,
  );

  const columns = useMemo<MRT_ColumnDef<ClustersTableValues>[]>(
    () =>
      getClusterTableColumns({
        t,
        environmentOptions: environments.data?.data?.map((environment) => environment.name) ?? [],
        postgresVersionOptions: postgresVersions.data?.data?.map((version) => version.major_version) ?? [],
      }),
    [i18n.language, environments.data?.data, postgresVersions.data?.data],
  );

  const data = useGetClustersTableData(clustersList.data?.data);

  const tableConfig: MRT_TableOptions<MRT_RowData> = {
    columns,
    data,
    enablePagination: true,
    enableRowSelection: true,
    showGlobalFilter: true,
    manualPagination: true,
    enableRowActions: true,
    enableStickyHeader: true,
    enableMultiSort: false,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: clustersList.data?.meta?.count ?? 0,
    state: {
      isLoading: clustersList.isFetching || environments.isFetching || postgresVersions.isFetching,
      pagination,
      sorting,
    },
    initialState: {
      columnVisibility: {
        [CLUSTER_TABLE_COLUMN_NAMES.LOCATION]: false,
      },
    },
    renderRowActions: ({ row }) => <RowActionsMenu row={row} ActionsComponent={ClustersTableRowActions} />,
    renderEmptyRowsFallback: () => <ClustersEmptyRowsFallback />,
  };

  return (
    <>
      <ClustersTableButtons refetch={clustersList.refetch} />
      <DefaultTable tableConfig={tableConfig} />
    </>
  );
};

export default ClustersTable;
