import { FC, lazy } from 'react';
import ClusterFormRegionBlock from '@entities/cluster/cloud-region-block';
import ClusterFormInstancesBlock from '@entities/cluster/instances-block';
import InstancesAmountBlock from '@entities/cluster/instances-amount-block';
import StorageBlock from '@entities/cluster/storage-block';
import ClusterFormSshKeyBlock from '@entities/cluster/ssh-key-block';
import { IS_EXPERT_MODE } from '@shared/model/constants.ts';

const NetworkBlock = lazy(() => import('@entities/cluster/expert-mode/network-block/ui'));

const ClusterFormCloudProviderFormPart: FC = () => (
  <>
    <ClusterFormRegionBlock />
    <ClusterFormInstancesBlock />
    <InstancesAmountBlock />
    <StorageBlock />
    {IS_EXPERT_MODE ? <NetworkBlock /> : null}
    <ClusterFormSshKeyBlock />
  </>
);

export default ClusterFormCloudProviderFormPart;
