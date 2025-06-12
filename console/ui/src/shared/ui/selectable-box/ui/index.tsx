import { FC } from 'react';
import { ClusterFormSelectableBoxProps } from '@shared/ui/selectable-box/model/types.ts';
import { Box, useTheme } from '@mui/material';

const SelectableBox: FC<ClusterFormSelectableBoxProps> = ({ isActive, children, sx, ...props }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        outline: `${isActive && `2px solid ${theme.palette.primary.main}`}`,
        cursor: 'pointer',
        ...sx,
      }}
      {...props}>
      {children}
    </Box>
  );
};

export default SelectableBox;
