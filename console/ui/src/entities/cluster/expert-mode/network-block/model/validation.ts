import { TFunction } from 'i18next';
import * as yup from 'yup';
import { NETWORK_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/network-block/model/const.ts';

export const NetworkBlockFormSchema = (t: TFunction) =>
  yup.object({
    [NETWORK_BLOCK_FIELD_NAMES.SERVER_NETWORK]: yup.string(),
  });
