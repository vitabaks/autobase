import { UseFieldArrayRemove } from 'react-hook-form';
import { DATABASE_SERVERS_FIELD_NAMES } from '@entities/cluster/database-servers-block/model/const.ts';

export interface DatabaseServerBlockProps {
  index: number;
  remove?: UseFieldArrayRemove;
}

export interface DatabaseServerBlockValues {
  [DATABASE_SERVERS_FIELD_NAMES.IS_CLUSTER_EXISTS]?: boolean;
  [DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS]: {
    [DATABASE_SERVERS_FIELD_NAMES.DATABASE_HOSTNAME]: string;
    [DATABASE_SERVERS_FIELD_NAMES.DATABASE_IP_ADDRESS]: string;
    [DATABASE_SERVERS_FIELD_NAMES.DATABASE_LOCATION]: string;
    [DATABASE_SERVERS_FIELD_NAMES.IS_POSTGRESQL_EXISTS]?: boolean;
  }[];
}
