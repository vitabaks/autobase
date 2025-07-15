import { FC } from 'react';
import { ClusterFormSelectableBoxProps } from '@shared/ui/selectable-box/model/types.ts';
import { Box, useTheme } from '@mui/material';

const SelectableBox: FC<ClusterFormSelectableBoxProps> = ({ isActive, children, sx, helperText, error, ...props }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        border: `2px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: 'transparent',
        '&:hover': {
          borderColor: isActive 
            ? theme.palette.primary.main 
            : theme.palette.mode === 'light' 
              ? '#3367D6' 
              : '#5A8DEE',
          backgroundColor: theme.palette.mode === 'light' 
            ? 'rgba(51, 103, 214, 0.02)' 
            : 'rgba(90, 141, 238, 0.04)',
          transform: 'translateY(-1px)',
          boxShadow: theme.palette.mode === 'light'
            ? '0 4px 8px rgba(0, 0, 0, 0.1)'
            : '0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        },
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: '2px',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...sx,
      }}
      tabIndex={0}
      role="button"
      {...props}>
      {children}
    </Box>
  );
};

export default SelectableBox;
