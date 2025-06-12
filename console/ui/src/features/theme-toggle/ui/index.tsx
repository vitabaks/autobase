import { FC, useState } from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Tooltip 
} from '@mui/material';
import { 
  LightMode, 
  DarkMode, 
  SettingsBrightness,
  Brightness6
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/redux/store/hooks';
import { selectThemeMode } from '@app/redux/slices/themeSlice/themeSelectors';
import { setThemeMode, type ThemeMode } from '@app/redux/slices/themeSlice/themeSlice';
import { useTranslation } from 'react-i18next';

const ThemeToggle: FC = () => {
  const { t } = useTranslation('shared');
  const dispatch = useAppDispatch();
  const currentMode = useAppSelector(selectThemeMode);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    dispatch(setThemeMode(mode));
    handleClose();
  };

  const getThemeIcon = () => {
    switch (currentMode) {
      case 'light':
        return <LightMode />;
      case 'dark':
        return <DarkMode />;
      case 'system':
        return <SettingsBrightness />;
      default:
        return <Brightness6 />;
    }
  };

  const getThemeLabel = (mode: ThemeMode) => {
    switch (mode) {
      case 'light':
        return t('theme.light', 'Light');
      case 'dark':
        return t('theme.dark', 'Dark');
      case 'system':
        return t('theme.system', 'System');
      default:
        return mode;
    }
  };

  return (
    <>
      <Tooltip title={t('theme.changeTheme', 'Change theme')}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ 
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
          aria-controls={open ? 'theme-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          {getThemeIcon()}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="theme-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
          <MenuItem
            key={mode}
            onClick={() => handleThemeChange(mode)}
            selected={currentMode === mode}
          >
            <ListItemIcon>
              {mode === 'light' && <LightMode />}
              {mode === 'dark' && <DarkMode />}
              {mode === 'system' && <SettingsBrightness />}
            </ListItemIcon>
            <ListItemText>{getThemeLabel(mode)}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ThemeToggle; 