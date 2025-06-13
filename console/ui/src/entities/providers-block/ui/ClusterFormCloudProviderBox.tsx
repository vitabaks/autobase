import { FC } from 'react';
import SelectableBox from '@shared/ui/selectable-box';
import { ClusterFormCloudProviderBoxProps } from '@entities/providers-block/model/types.ts';

const ClusterFormCloudProviderBox: FC<ClusterFormCloudProviderBoxProps> = ({ children, isActive, ...props }) => {
  return (
    <SelectableBox
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '120px',
        width: '120px',
      }}
      isActive={isActive}
      {...props}>
      {children}
    </SelectableBox>
  );
};

export default ClusterFormCloudProviderBox;
