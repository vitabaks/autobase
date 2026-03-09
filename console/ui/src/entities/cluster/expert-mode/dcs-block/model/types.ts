import { UseFieldArrayRemove } from 'react-hook-form';
import { DCS_BLOCK_FIELD_NAMES } from './const';

export interface DcsDatabaseBoxProps {
  index: number;
  remove?: UseFieldArrayRemove;
  fields: { fieldName: string; label: string; required?: boolean }[];
}

export interface DcsBlockFormValues {
  [DCS_BLOCK_FIELD_NAMES.TYPE]: string;
  [DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_NEW_CLUSTER]: boolean;
  [DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_TO_DB_SERVERS]: boolean;
  [DCS_BLOCK_FIELD_NAMES.DCS_DATABASES]?: {
    [DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_HOSTNAME]?: string;
    [DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_IP_ADDRESS]?: string;
    [DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_SSH_PORT]?: string;
    [DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_PORT]?: string;
  }[];
}
