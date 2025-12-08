import { UseFieldArrayRemove } from 'react-hook-form';
import { DATABASES_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/databases-block/model/const.ts';

export interface DatabasesBlockProps {
  index: number;
  remove?: UseFieldArrayRemove;
}

export interface DatabasesBlockSingleValue {
  [DATABASES_BLOCK_FIELD_NAMES.DATABASE_NAME]?: string;
  [DATABASES_BLOCK_FIELD_NAMES.USER_NAME]?: string;
  [DATABASES_BLOCK_FIELD_NAMES.USER_PASSWORD]?: string;
  [DATABASES_BLOCK_FIELD_NAMES.ENCODING]?: string;
  [DATABASES_BLOCK_FIELD_NAMES.LOCALE]?: string;
  [DATABASES_BLOCK_FIELD_NAMES.BLOCK_ID]: string;
}

export interface DatabasesBlockValues {
  [DATABASES_BLOCK_FIELD_NAMES.DATABASES]?: DatabasesBlockSingleValue[];
  [DATABASES_BLOCK_FIELD_NAMES.NAMES]?: Record<string, string>;
}
