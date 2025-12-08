import React, { FC, useMemo, useState } from 'react';
import { PAGINATION_LIMIT_OPTIONS } from '@shared/config/constants.ts';
import { MRT_ColumnDef, MRT_RowData, MRT_TableOptions } from 'material-react-table';
import { ProjectsTableValues } from '@widgets/projects-table/model/types.ts';
import { projectsTableColumns } from '@widgets/projects-table/model/constants.ts';
import { useTranslation } from 'react-i18next';
import { useGetProjectsTableData } from '@widgets/projects-table/lib/hooks.tsx';
import { useGetProjectsQuery } from '@shared/api/api/projects.ts';
import ProjectsTableButtons from '@widgets/projects-table/ui/ProjectsTableButtons.tsx';
import ProjectsTableRowActions from '@features/pojects-table-row-actions';
import DefaultTable from '@shared/ui/default-table';
import RowActionsMenu from '@features/row-actions-menu/ui';

const ProjectsTable: FC = () => {
  const { t, i18n } = useTranslation(['settings', 'shared']);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGINATION_LIMIT_OPTIONS[1].value,
  });

  const projectsList = useGetProjectsQuery({
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
  });

  const columns = useMemo<MRT_ColumnDef<ProjectsTableValues>[]>(() => projectsTableColumns(t), [i18n.language]);

  const data = useGetProjectsTableData(projectsList.data?.data);

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
    rowCount: projectsList.data?.meta?.count ?? 0,
    state: {
      isLoading: projectsList.isFetching,
      pagination,
    },
    renderRowActions: ({ row }) => <RowActionsMenu row={row} ActionsComponent={ProjectsTableRowActions} />,
  };

  return (
    <>
      <ProjectsTableButtons />
      <DefaultTable tableConfig={tableConfig} />
    </>
  );
};

export default ProjectsTable;
