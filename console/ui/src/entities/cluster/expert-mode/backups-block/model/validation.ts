import { TFunction } from 'i18next';
import * as yup from 'yup';
import { BACKUPS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/backups-block/model/const.ts';
import { configValidationSchema } from '@shared/model/validation.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';

export const BackupsBlockFormSchema = (t: TFunction) =>
  yup.object({
    [BACKUPS_BLOCK_FIELD_NAMES.IS_BACKUPS_ENABLED]: yup.boolean(),
    [BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL]: yup
      .mixed()
      .when(
        [CLUSTER_FORM_FIELD_NAMES.PROVIDER, BACKUPS_BLOCK_FIELD_NAMES.IS_BACKUPS_ENABLED],
        ([provider, isBackupsEnabled]) =>
          provider?.code === PROVIDERS.LOCAL && isBackupsEnabled
            ? configValidationSchema(t).required(t('requiredField', { ns: 'validation' }))
            : configValidationSchema(t).optional(),
      ),
    [BACKUPS_BLOCK_FIELD_NAMES.BACKUP_START_TIME]: yup.string(),
    [BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION]: yup.number().typeError(t('onlyNumbers', { ns: 'validation' })),
  });
