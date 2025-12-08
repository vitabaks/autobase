import * as yup from 'yup';
import { TFunction } from 'i18next';
import { CONNECTION_POOLS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/connection-pools-block/model/const.ts';

export const ConnectionPoolsBlockSchema = (t: TFunction) =>
  yup.object({
    [CONNECTION_POOLS_BLOCK_FIELD_NAMES.IS_CONNECTION_POOLER_ENABLED]: yup.boolean(),
    [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS]: yup.array(
      yup.object({
        [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_NAME]: yup.string(),
        [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_SIZE]: yup.number().typeError(t('onlyNumbers', { ns: 'validation' })),
        [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_MODE]: yup.string(),
      }),
    ),
  });
