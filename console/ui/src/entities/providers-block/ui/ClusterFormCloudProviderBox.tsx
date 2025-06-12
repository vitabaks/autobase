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
          filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none',
        },
      }}
      isActive={isActive}
      {...props}>
      {children}
    </SelectableBox>
  );
};

export default ClusterFormCloudProviderBox;
