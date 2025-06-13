import { FC } from 'react';
import SelectableBox from '@shared/ui/selectable-box';
import { ClusterFormCloudProviderBoxProps } from '@entities/providers-block/model/types.ts';
import { useTheme } from '@mui/material';

const ClusterFormCloudProviderBox: FC<ClusterFormCloudProviderBoxProps> = ({ children, isActive, ...props }) => {
  const theme = useTheme();

  return (
    <SelectableBox
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '120px',
        width: '120px',
        img: {
          filter: theme.palette.mode === 'dark' 
            ? 'brightness(2.0) contrast(1.1) saturate(1.2)' 
            : 'none',
          transition: 'filter 0.3s ease-in-out',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          borderRadius: '8px',
          padding: '8px',
          boxShadow: theme.palette.mode === 'dark' ? '0 2px 8px rgba(255, 255, 255, 0.05)' : 'none',
        },
      }}
      isActive={isActive}
      {...props}>
      {children}
    </SelectableBox>
  );
};

export default ClusterFormCloudProviderBox;
