import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { SidebarItemProps } from '@entities/sidebar-item/model/types.ts';

const SidebarItemContent: FC<SidebarItemProps> = ({
  path,
  label,
  icon: SidebarIcon,
  isActive,
  target,
  isCollapsed,
}) => {
  const theme = useTheme();

  return (
    <ListItemButton
      sx={{
        gap: isCollapsed ? 0 : '12px',
        position: 'relative',
        height: '50px',
        px: isCollapsed ? 0 : '16px',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        color: 'text.primary',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
        },
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
      to={path}
      target={target}
      component={Link}>
      <ListItemIcon
        sx={{
          minWidth: 0,
          width: '30px',
          margin: 0,
          display: 'flex',
          justifyContent: 'center',
          color: 'text.primary',
          '& svg': {
            fill: 'currentColor',
            color: 'text.primary',
          },
        }}>
        {SidebarIcon ? <SidebarIcon width="30px" height="30px" /> : null}
      </ListItemIcon>
      {!isCollapsed ? (
        <ListItemText
          primary={label}
          sx={{
            color: 'text.primary',
            '& .MuiListItemText-primary': {
              color: 'text.primary',
            },
          }}
        />
      ) : null}
    </ListItemButton>
  );
};

export default SidebarItemContent;
