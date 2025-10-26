import { FC } from 'react';
import DatabaseServersBlock from '@entities/cluster/database-servers-block';
import AuthenticationMethodFormBlock from '@entities/authentification-method-form-block';
import VipAddressBlock from '@entities/cluster/vip-address-block';
import LoadBalancersBlock from '@entities/cluster/load-balancers-block';

const ClusterFormLocalMachineFormPart: FC = () => (
  <>
    <DatabaseServersBlock />
    <AuthenticationMethodFormBlock />
    <VipAddressBlock />
    <LoadBalancersBlock />
  </>
);

export default ClusterFormLocalMachineFormPart;
