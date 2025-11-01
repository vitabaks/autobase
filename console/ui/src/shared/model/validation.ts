import * as yup from 'yup';

export const configValidationSchema = (t: TFunction) =>
  yup
    .string()
    .test(
      'should have correct format',
      t('configFormat', { ns: 'validation' }),
      (value) =>
        /^[a-z0-9]+\s*:\s*[a-z0-9]+\s*(\n[a-z0-9]+\s*:\s*[a-z0-9]+\s*)*$/i.test(value) ||
        /^[a-z0-9]+\s*=\s*[a-z0-9]+\s*(\n[a-z0-9]+\s*=\s*[a-z0-9]+\s*)*$/i.test(value) ||
        value === '',
    );
