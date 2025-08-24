import { useState, FC, MouseEvent } from 'react';
import { IconButton, Menu } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { MRT_Row, MRT_RowData } from 'material-react-table';

interface RowActionsMenuProps {
  row: MRT_Row<MRT_RowData>;
  ActionsComponent: FC<{ closeMenu: () => void; row: MRT_Row<MRT_RowData> }>;
}

const RowActionsMenu: FC<RowActionsMenuProps> = ({ row, ActionsComponent }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleOpenMenu}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleCloseMenu}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}>
        <ActionsComponent row={row} closeMenu={handleCloseMenu} />
      </Menu>
    </>
  );
};

export default RowActionsMenu;
