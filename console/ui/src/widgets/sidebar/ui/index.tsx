import { COLLAPSED_SIDEBAR_WIDTH, OPEN_SIDEBAR_WIDTH, sidebarData, sidebarLowData } from '../model/constants.ts';
import SidebarItem from '@entities/sidebar-item';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Box, Divider, Drawer, IconButton, List, Stack, Toolbar, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import CollapseIcon from '@shared/assets/collapseIcon.svg?react';

const Sidebar = () => {
  const { t } = useTranslation('shared');
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem('isSidebarCollapsed')?.toString() === 'true');

  const isLesserThan1600 = useMediaQuery('(max-width: 1600px)');

  const toggleSidebarCollapse = () => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem('isSidebarCollapsed', newValue);
      return newValue;
    });
  };

  const isActive = (path: string) => {
    return location.pathname?.includes(path);
  };

  useEffect(() => {
    if ((!isCollapsed && isLesserThan1600) || (isCollapsed && !isLesserThan1600)) toggleSidebarCollapse();
  }, [isLesserThan1600]);

  const sidebarItems = sidebarData(t).map((item) => (
    <SidebarItem
      key={item.label + item.path}
      {...item}
      isActive={isActive(item.path)} //TODO: fix
      isCollapsed={isCollapsed}
    />
  ));

  const sidebarLowIcons = sidebarLowData(t).map((item) => (
    <SidebarItem key={item.label + item.path} isCollapsed={isCollapsed} target="_blank" {...item} />
  ));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? COLLAPSED_SIDEBAR_WIDTH : OPEN_SIDEBAR_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: isCollapsed ? COLLAPSED_SIDEBAR_WIDTH : OPEN_SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          transition: 'width .1s ease-in-out',
        },
      }}>
      <Toolbar />
      <Stack
        direction="column"
        height="100%"
        width="100%"
        overflow="auto"
        alignItems="flex-start"
        justifyContent="center">
        <List sx={{ width: '100%' }}>{sidebarItems}</List>
        <Box sx={{ height: '100%' }} />
        <Divider flexItem />
        <List sx={{ width: '100%', padding: '8px 0 8px 0' }}>{sidebarLowIcons}</List>
        <Divider flexItem />
        <IconButton
          sx={{
            width: '100%',
            transform: isCollapsed ? 'scale(-1, 1)' : 'none',
            transition: 'transform .1s ease-in-out',
            borderRadius: 0,
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '& svg': {
              fill: 'currentColor',
            },
          }}
          onClick={toggleSidebarCollapse}>
          <CollapseIcon width="24px" height="24px" />
        </IconButton>
      </Stack>
    </Drawer>
  );
};

export default Sidebar;
