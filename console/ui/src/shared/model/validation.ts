import * as yup from 'yup';
import { TFunction } from 'i18next';

export const configValidationSchema = (t: TFunction) =>
  yup.string().test('should have correct format', t('configFormat', { ns: 'validation' }), (value) => {
    if (value == null || value === '') {
      return true;
    }

    const lines = value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    return lines.length > 0 && lines.every((line) => /^[^:=\n\r]+[:=][^\n\r]+$/i.test(line));
  });
