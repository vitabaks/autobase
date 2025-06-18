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
        gap: '12px',
        borderLeft: `3px solid ${isActive ? theme.palette.primary.main : 'transparent'}`,
        height: '50px',
        color: 'text.primary',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
      to={path}
      target={target}
      component={Link}>
      <ListItemIcon
        sx={{
          minWidth: 'fit-content',
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
