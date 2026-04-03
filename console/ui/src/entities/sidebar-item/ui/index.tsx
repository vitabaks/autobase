import { FC } from 'react';
import { SidebarItemProps } from '../model/types.ts';
import { Box, ListItem, Tooltip, useTheme } from '@mui/material';
import SidebarItemContent from '@entities/sidebar-item/ui/SidebarItemContent.tsx';

const SidebarItem: FC<SidebarItemProps> = ({ path, label, icon, isActive, isCollapsed = false, target, ...props }) => {
  const theme = useTheme();

  return (
    <ListItem
      disablePadding
      sx={{
        background: isActive ? theme.palette.primary.lighter10 : 'none',
      }}>
      {isCollapsed ? (
        <Tooltip title={label} arrow placement="right">
          <Box sx={{ width: '100%' }}>
            <SidebarItemContent
              path={path}
              label={label}
              icon={icon}
              isActive={isActive}
              isCollapsed
              target={target}
              {...props}
            />
          </Box>
        </Tooltip>
      ) : (
        <SidebarItemContent path={path} label={label} icon={icon} isActive={isActive} target={target} {...props} />
      )}
    </ListItem>
  );
};

export default SidebarItem;
