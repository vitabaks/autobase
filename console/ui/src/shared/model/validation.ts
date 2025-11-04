import * as yup from 'yup';
import { TFunction } from 'i18next';

export const configValidationSchema = (t: TFunction) =>
  yup
    .string()
    .test(
      'should have correct format',
      t('configFormat', { ns: 'validation' }),
      (value) =>
        /^[^:=\n\r]+:[^:=\n\r]+(\n\r[^:=\n\r]+:[^:=\n\r]+)*$/i.test(value) ||
        /^[^:=\n\r]+=[^:=\n\r]+(\n\r[^:=\n\r]+=[^:=\n\r]+)*$/i.test(value) ||
        value === '',
    );
