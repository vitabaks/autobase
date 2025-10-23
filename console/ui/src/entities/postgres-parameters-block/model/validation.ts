import { TFunction } from 'i18next';
import * as yup from 'yup';
import { POSTGRES_PARAMETERS_FIELD_NAMES } from '@entities/postgres-parameters-block/model/const.ts';
import { configValidationSchema } from '@shared/model/validation.ts';

export const PostgresParametersBlockFormSchema = (t: TFunction) =>
  yup.object({
    [POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS]: configValidationSchema(t),
  });
