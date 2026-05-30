import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ListItemIcon, MenuItem } from '@mui/material';
import { TableRowActionsProps } from '@shared/model/types.ts';
import { useNavigate } from 'react-router-dom';
import RouterPaths from '@app/router/routerPathsConfig';
import { generateAbsoluteRouterPath } from '@shared/lib/functions.ts';
import VisibilityIcon from '@mui/icons-material/Visibility';

const OperationsTableRowActions: FC<TableRowActionsProps> = ({ closeMenu, row }) => {
  const { t } = useTranslation('operations');
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(generateAbsoluteRouterPath(RouterPaths.operations.log.absolutePath, { operationId: row.original.id }));
    closeMenu();
  };

  return [
    <MenuItem key={0} onClick={handleButtonClick} sx={{ m: 0 }}>
      <ListItemIcon>
        <VisibilityIcon />
      </ListItemIcon>
      {t('showDetails')}
    </MenuItem>,
  ];
};

export default OperationsTableRowActions;
