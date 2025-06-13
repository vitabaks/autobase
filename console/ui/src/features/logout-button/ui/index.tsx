import { FC } from 'react';
import Logout from '@mui/icons-material/LogoutOutlined';
import { IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RouterPaths from '@app/router/routerPathsConfig';
import { generateAbsoluteRouterPath } from '@shared/lib/functions.ts';
import { useTranslation } from 'react-i18next';

const LogoutButton: FC = () => {
  const { t } = useTranslation('shared');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate(generateAbsoluteRouterPath(RouterPaths.login.absolutePath));
  };

  return (
    <Tooltip title={t('logout')}>
      <IconButton
        onClick={handleLogout}
        size="small"
        sx={{
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          '& svg': {
            fill: 'currentColor !important',
            '& path': {
              fill: 'currentColor !important',
            },
          },
        }}
      >
        <Logout />
      </IconButton>
    </Tooltip>
  );
};

export default LogoutButton;
