import { FC, lazy } from 'react';
import ClusterFormRegionBlock from '@entities/cluster/cloud-region-block';
import ClusterFormInstancesBlock from '@entities/cluster/instances-block';
import InstancesAmountBlock from '@entities/cluster/instances-amount-block';
import StorageBlock from '@entities/cluster/storage-block';
import ClusterFormSshKeyBlock from '@entities/cluster/ssh-key-block';
import { IS_EXPERT_MODE } from '@shared/model/constants.ts';
import { useWatch } from 'react-hook-form';
import { STORAGE_BLOCK_FIELDS } from '@entities/cluster/storage-block/model/const.ts';

const NetworkBlock = lazy(() => import('@entities/cluster/expert-mode/network-block/ui'));
const DataDirectoryBlock = lazy(() => import('@entities/cluster/expert-mode/data-directory-block/ui'));

const ClusterFormCloudProviderFormPart: FC = () => {
  const watchStorageAmount = useWatch({ name: STORAGE_BLOCK_FIELDS.STORAGE_AMOUNT });

  return (
    <>
      <ClusterFormRegionBlock />
      <ClusterFormInstancesBlock />
      <InstancesAmountBlock />
      <StorageBlock />
      {watchStorageAmount === 0 ? <DataDirectoryBlock /> : null}
      {IS_EXPERT_MODE ? <NetworkBlock /> : null}
      <ClusterFormSshKeyBlock />
    </>
  );
};

export default ClusterFormCloudProviderFormPart;
