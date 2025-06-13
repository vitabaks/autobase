import { FC } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@app/redux/store/hooks.ts';
import { selectThemeMode } from '@app/redux/slices/themeSlice/themeSelectors.ts';
import { setThemeMode } from '@app/redux/slices/themeSlice/themeSlice.ts';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import SystemModeIcon from '@mui/icons-material/ContrastOutlined';
import { ThemeMode } from '@app/redux/slices/themeSlice/themeSlice.ts';

const ThemeToggle: FC = () => {
  const { t } = useTranslation('shared');
  const dispatch = useAppDispatch();
  const currentMode = useAppSelector(selectThemeMode);

  const getNextMode = (mode: ThemeMode): ThemeMode => {
    switch (mode) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'system';
      case 'system':
        return 'light';
      default:
        return 'system';
    }
  };

  const handleToggle = () => {
    const nextMode = getNextMode(currentMode);
    dispatch(setThemeMode(nextMode));
  };

  const getIcon = () => {
    switch (currentMode) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      case 'system':
        return <SystemModeIcon />;
      default:
        return <LightModeIcon />;
    }
  };

  const getTooltipText = () => {
    const nextMode = getNextMode(currentMode);
    switch (nextMode) {
      case 'light':
        return t('switchToLightMode');
      case 'dark':
        return t('switchToDarkMode');
      case 'system':
        return t('switchToSystemMode');
      default:
        return t('switchToLightMode');
    }
  };

  return (
    <Tooltip title={getTooltipText()}>
      <IconButton onClick={handleToggle} size="small">
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 