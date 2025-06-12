import { FC } from 'react';
import { MaterialReactTable, MRT_RowData, MRT_TableOptions, useMaterialReactTable } from 'material-react-table';
import { PAGINATION_LIMIT_OPTIONS } from '@shared/config/constants.ts';
import { useTranslation } from 'react-i18next';

/**
 * Common table with default styles.
 * @param tableConfig - Object with additional table configuration.
 * @constructor
 */
const DefaultTable: FC = ({ tableConfig }: { tableConfig: MRT_TableOptions<MRT_RowData> }) => {
  const { t } = useTranslation('shared');

  const table = useMaterialReactTable({
    muiPaginationProps: {
      rowsPerPageOptions: PAGINATION_LIMIT_OPTIONS,
    },
    muiSearchTextFieldProps: {
      placeholder: t('defaultTableSearchPlaceholder'),
      sx: { minWidth: '300px' },
    },
    displayColumnDefOptions: {
      'mrt-row-select': {
        visibleInShowHideMenu: false,
      },
      'mrt-row-actions': {
        visibleInShowHideMenu: false,
      },
    },
    layoutMode: 'grid',
    positionActionsColumn: 'last',
    positionGlobalFilter: 'left',
    ...tableConfig,
  });

  return <MaterialReactTable table={table} />;
};

export default DefaultTable;
