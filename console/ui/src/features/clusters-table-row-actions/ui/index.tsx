import { FC } from 'react';
import { TableRowActionsProps } from '@shared/model/types.ts';
import { MenuItem } from '@mui/material';
import ClustersTableRemoveButton from './ClusterTableRemoveButton';
import ClustersTableExportButton from './ClusterTableExportButton';

const ClustersTableRowActions: FC<TableRowActionsProps> = ({ closeMenu, row }) => {
  return (
    <>
      <MenuItem disableGutters>
        <ClustersTableExportButton
          clusterId={row.original.id}
          clusterName={row.original.name.props.children}
          closeMenu={closeMenu}
        />
      </MenuItem>
      <MenuItem disableGutters>
        <ClustersTableRemoveButton
          clusterId={row.original.id}
          clusterName={row.original.name.props.children}
          closeMenu={closeMenu}
        />
      </MenuItem>
    </>
  );
};

export default ClustersTableRowActions;
