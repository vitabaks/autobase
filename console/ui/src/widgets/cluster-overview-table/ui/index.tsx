import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MRT_ColumnDef, MRT_RowData, MRT_TableOptions } from 'material-react-table';
import { ClusterOverviewTableProps } from '@widgets/cluster-overview-table/model/types.ts';
import {
  CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES,
  clusterOverviewTableColumns,
} from '@widgets/cluster-overview-table/model/constants.ts';
import ClustersOverviewTableButtons from '@widgets/cluster-overview-table/ui/ClustersOverviewTableButtons.tsx';
import { useGetOverviewClusterTableData } from '@widgets/cluster-overview-table/lib/hooks.tsx';
import { ClusterInfo } from '@shared/api/api/clusters.ts';
import DefaultTable from '@shared/ui/default-table';
import { Stack, Typography } from '@mui/material';
import ClustersOverviewTableRowActions from '@features/clusters-overview-table-row-actions';
import RowActionsMenu from '@features/row-actions-menu/ui';

const ClusterOverviewTable: FC<ClusterOverviewTableProps> = ({ clusterName = '', items, isLoading }) => {
  const { t, i18n } = useTranslation('clusters');

  const columns = useMemo<MRT_ColumnDef<ClusterInfo>[]>(() => clusterOverviewTableColumns(t), [i18n.language]);

  const data = useGetOverviewClusterTableData(items);

  const tableConfig: MRT_TableOptions<MRT_RowData> = {
    columns,
    data,
    enablePagination: false,
    enableRowActions: true,
    showGlobalFilter: false,
    state: {
      isLoading,
    },
    initialState: {
      columnVisibility: {
        [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.PENDING_RESTART]: false,
        [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.TAGS]: false,
      },
    },
    renderRowActions: ({ row }) => <RowActionsMenu row={row} ActionsComponent={ClustersOverviewTableRowActions} />,
  };

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontWeight="bold">
          {t('cluster')}: {clusterName}
        </Typography>
        <ClustersOverviewTableButtons />
      </Stack>
      <DefaultTable tableConfig={tableConfig} />
    </>
  );
};

export default ClusterOverviewTable;
