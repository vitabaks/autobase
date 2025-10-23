import * as yup from 'yup';
import { DATABASES_BLOCK_FIELD_NAMES } from '@entities/databases-block/model/const.ts';

export const DatabasesBlockSchema = yup.object({
  [DATABASES_BLOCK_FIELD_NAMES.DATABASES]: yup.array(
    yup.object({
      [DATABASES_BLOCK_FIELD_NAMES.DATABASE_NAME]: yup.string(),
      [DATABASES_BLOCK_FIELD_NAMES.USER_NAME]: yup.string(),
      [DATABASES_BLOCK_FIELD_NAMES.USER_PASSWORD]: yup.string(),
      [DATABASES_BLOCK_FIELD_NAMES.ENCODING]: yup.string(),
      [DATABASES_BLOCK_FIELD_NAMES.LOCALE]: yup.string(),
    }),
  ),
});
