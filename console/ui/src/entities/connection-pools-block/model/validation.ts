import * as yup from 'yup';
import { CONNECTION_POOLS_BLOCK_FIELD_NAMES } from '@entities/connection-pools-block/model/const.ts';

export const ConnectionPoolsBlockSchema = yup.object({
  [CONNECTION_POOLS_BLOCK_FIELD_NAMES.IS_CONNECTION_POOLER_ENABLED]: yup.boolean(),
  [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS]: yup.array(
    yup.object({
      [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_NAME]: yup.string(),
      [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_SIZE]: yup.number(),
      [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_MODE]: yup.string(),
    }),
  ),
});
