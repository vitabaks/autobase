import { FC, useState } from 'react';
import { TableRowActionsProps } from '@shared/model/types.ts';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import ClustersTableRemoveButton from './ClusterTableRemoveButton';
import ClustersTableExportButton from './ClusterTableExportButton';

const ClustersTableRowActions: FC<TableRowActionsProps> = ({ closeMenu, row }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorEl(null);
    closeMenu();
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen} size="small">
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem disableGutters>
          <ClustersTableExportButton
            clusterId={row.original.id}
            clusterName={row.original.name.props.children}
            closeMenu={handleMenuClose}
          />
        </MenuItem>
        <MenuItem disableGutters>
          <ClustersTableRemoveButton
            clusterId={row.original.id}
            clusterName={row.original.name.props.children}
            closeMenu={handleMenuClose}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ClustersTableRowActions;
