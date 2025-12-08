import { FC, lazy } from 'react';
import DatabaseServersBlock from '@entities/cluster/database-servers-block';
import AuthenticationMethodFormBlock from '@entities/authentification-method-form-block';
import VipAddressBlock from '@entities/cluster/vip-address-block';
import LoadBalancersBlock from '@entities/cluster/load-balancers-block';
import { IS_EXPERT_MODE } from '@shared/model/constants.ts';

const DcsBlock = lazy(() => import('@entities/cluster/expert-mode/dcs-block/ui'));

const ClusterFormLocalMachineFormPart: FC = () => (
  <>
    <DatabaseServersBlock />
    {IS_EXPERT_MODE ? <DcsBlock /> : null}
    <AuthenticationMethodFormBlock />
    <VipAddressBlock />
    <LoadBalancersBlock />
  </>
);

export default ClusterFormLocalMachineFormPart;
