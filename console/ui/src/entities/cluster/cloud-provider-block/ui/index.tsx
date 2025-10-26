import { FC } from 'react';
import { ClusterFormCloudProviderBoxProps } from '@entities/cluster/cloud-provider-block/model/types.ts';
import SelectableBox from '@shared/ui/selectable-box';

const ClusterFormCloudProviderBox: FC<ClusterFormCloudProviderBoxProps> = ({ children, isActive, ...props }) => (
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

export default ClusterFormCloudProviderBox;
