import { FC } from 'react';
import ClusterFormRegionBlock from '@entities/cluster/cloud-region-block';
import ClusterFormInstancesBlock from '@entities/cluster/instances-block';
import InstancesAmountBlock from '@entities/cluster/instances-amount-block';
import StorageBlock from '@entities/cluster/storage-block';
import ClusterFormSshKeyBlock from '@entities/cluster/ssh-key-block';

const ClusterFormCloudProviderFormPart: FC = () => (
  <>
    <ClusterFormRegionBlock />
    <ClusterFormInstancesBlock />
    <InstancesAmountBlock />
    <StorageBlock />
    <ClusterFormSshKeyBlock />
  </>
);

export default ClusterFormCloudProviderFormPart;
