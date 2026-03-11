import { COLLAPSED_SIDEBAR_WIDTH, OPEN_SIDEBAR_WIDTH, sidebarData, sidebarLowData } from '../model/constants.ts';
import SidebarItem from '@entities/sidebar-item';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Box, Divider, Drawer, IconButton, List, Stack, Toolbar, useMediaQuery } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import CollapseIcon from '@shared/assets/collapseIcon.svg?react';
import RouterPaths from '@app/router/routerPathsConfig';

const Sidebar = () => {
  const { t } = useTranslation('shared');
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem('isSidebarCollapsed')?.toString() === 'true');

  const isLesserThan1600 = useMediaQuery('(max-width: 1600px)');

  // Track whether sidebar was force-collapsed by the SQL Editor route
  const prevIsSqlEditorRef = useRef(false);
  const prevCollapsedRef = useRef(isCollapsed);

  // Keep a ref in sync with isCollapsed so effects can read it without depending on it
  const isCollapsedRef = useRef(isCollapsed);
  isCollapsedRef.current = isCollapsed;

  const toggleSidebarCollapse = () => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem('isSidebarCollapsed', String(newValue));
      // If user manually toggles while on SQL Editor, update the saved state
      // so leaving SQL Editor restores to the user's latest preference
      if (location.pathname?.startsWith(RouterPaths.sqlEditor.absolutePath)) {
        prevCollapsedRef.current = newValue;
      }
      return newValue;
    });
  };

  const isActive = (path: string) => {
    return location.pathname?.includes(path);
  };

  useEffect(() => {
    if ((!isCollapsed && isLesserThan1600) || (isCollapsed && !isLesserThan1600)) toggleSidebarCollapse();
  }, [isLesserThan1600]);

  // Auto-collapse sidebar when entering SQL Editor route, restore when leaving
  const isSqlEditor = location.pathname?.startsWith(RouterPaths.sqlEditor.absolutePath);

  useEffect(() => {
    const wasOnSqlEditor = prevIsSqlEditorRef.current;
    prevIsSqlEditorRef.current = isSqlEditor;

    if (isSqlEditor && !wasOnSqlEditor) {
      // Entering SQL Editor — save current state and force collapse
      prevCollapsedRef.current = isCollapsedRef.current;
      if (!isCollapsedRef.current) {
        setIsCollapsed(true);
      }
    } else if (!isSqlEditor && wasOnSqlEditor) {
      // Leaving SQL Editor — restore previous state
      setIsCollapsed(prevCollapsedRef.current);
    }
  }, [isSqlEditor]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? COLLAPSED_SIDEBAR_WIDTH : OPEN_SIDEBAR_WIDTH,
        flexShrink: 0,
        overflow: 'auto',
        [`& .MuiDrawer-paper`]: {
          width: isCollapsed ? COLLAPSED_SIDEBAR_WIDTH : OPEN_SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          transition: 'width .1s ease-in-out',
        },
      }}>
      <Toolbar />
      <Stack direction="column" height="100%" width="100%" alignItems="flex-start" justifyContent="center">
        <List sx={{ width: '100%' }}>
          {sidebarData(t).map((item) => (
            <SidebarItem
              key={item.label + item.path}
              {...item}
              isActive={isActive(item.path)}
              isCollapsed={isCollapsed}
            />
          ))}
        </List>
        <Box sx={{ height: '100%' }} />
        <Divider flexItem />
        <List sx={{ width: '100%', padding: '8px 0 8px 0' }}>
          {sidebarLowData(t).map((item) => (
            <SidebarItem key={item.label + item.path} isCollapsed={isCollapsed} target="_blank" {...item} />
          ))}
        </List>
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
