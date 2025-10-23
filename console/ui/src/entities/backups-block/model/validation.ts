import { TFunction } from 'i18next';
import * as yup from 'yup';
import { BACKUPS_BLOCK_FIELD_NAMES } from '@entities/backups-block/model/const.ts';
import { configValidationSchema } from '@shared/model/validation.ts';

export const BackupsBlockFormSchema = (t: TFunction) =>
  yup.object({
    [BACKUPS_BLOCK_FIELD_NAMES.IS_BACKUPS_ENABLED]: yup.boolean(),
    [BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL]: configValidationSchema(t),
    [BACKUPS_BLOCK_FIELD_NAMES.CONFIG_STANZA]: configValidationSchema(t),
    [BACKUPS_BLOCK_FIELD_NAMES.BACKUP_START_TIME]: yup.object({ label: yup.string(), value: yup.number() }),
    [BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION]: yup.number(),
  });
