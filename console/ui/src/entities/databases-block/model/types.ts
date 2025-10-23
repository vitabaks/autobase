import { UseFieldArrayRemove } from 'react-hook-form';
import { DATABASES_BLOCK_FIELD_NAMES } from '@entities/databases-block/model/const.ts';

export interface DatabasesBlockProps {
  index: number;
  remove?: UseFieldArrayRemove;
}

export interface DatabasesBlockValues {
  [DATABASES_BLOCK_FIELD_NAMES.DATABASES]?: {
    [DATABASES_BLOCK_FIELD_NAMES.DATABASE_NAME]?: string;
    [DATABASES_BLOCK_FIELD_NAMES.USER_NAME]?: string;
    [DATABASES_BLOCK_FIELD_NAMES.USER_PASSWORD]?: string;
    [DATABASES_BLOCK_FIELD_NAMES.ENCODING]?: string;
    [DATABASES_BLOCK_FIELD_NAMES.LOCALE]?: string;
  }[];
}
