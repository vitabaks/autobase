import { TFunction } from 'i18next';
import * as yup from 'yup';
import { ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/additional-settings-block/model/const.ts';

export const AdditionalSettingsBlockFormSchema = (t: TFunction) =>
  yup.object({
    [ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.SYNC_STANDBY_NODES]: yup
      .number()
      .typeError(t('onlyNumbers', { ns: 'validation' })),
    [ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_SYNC_MODE_STRICT]: yup.boolean(),
    [ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_DB_PUBLIC_ACCESS]: yup.boolean(),
    [ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_CLOUD_LOAD_BALANCER]: yup.boolean(),
    [ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_NETDATA_MONITORING]: yup.boolean(),
  });
