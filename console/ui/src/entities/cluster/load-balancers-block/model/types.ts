import { UseFieldArrayRemove } from 'react-hook-form';
import { LOAD_BALANCERS_FIELD_NAMES } from './const';

export interface LoadBalancersDatabaseBoxProps {
  index: number;
  remove?: UseFieldArrayRemove;
}

export interface LoadBalancersBlockValues {
  [LOAD_BALANCERS_FIELD_NAMES.IS_HAPROXY_ENABLED]: boolean;
  [LOAD_BALANCERS_FIELD_NAMES.IS_DEPLOY_TO_DATABASE_SERVERS]?: boolean;
  [LOAD_BALANCERS_FIELD_NAMES.DATABASES]: {
    [LOAD_BALANCERS_FIELD_NAMES.DATABASES_HOSTNAME]?: string;
    [LOAD_BALANCERS_FIELD_NAMES.DATABASES_ADDRESS]?: string;
  }[];
}
