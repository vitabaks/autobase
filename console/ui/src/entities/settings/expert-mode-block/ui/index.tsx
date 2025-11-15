import { FC } from 'react';
import { Stack, Switch, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { SETTINGS_FORM_FIELDS_NAMES } from '@entities/settings/proxy-block/model/constants.ts';
import { useTranslation } from 'react-i18next';

const SettingExpertModeBlock: FC = () => {
  const { t } = useTranslation('settings');

  const { control } = useFormContext();

  return (
    <Stack gap={1} alignItems="start">
      <Typography fontWeight="bold">{t('expertMode')}</Typography>
      <Typography whiteSpace="pre-line">{t('expertModeInfo')}</Typography>
      {[
        {
          fieldName: SETTINGS_FORM_FIELDS_NAMES.IS_EXPERT_MODE_ENABLED,
          label: t('enableExpertMode'),
        },
        {
          fieldName: SETTINGS_FORM_FIELDS_NAMES.IS_YAML_ENABLED,
          label: t('enableYamlTab'),
        },
      ].map(({ fieldName, label }) => (
        <Controller
          key={fieldName}
          control={control}
          name={fieldName}
          render={({ field }) => (
            <Stack direction="row" alignItems="center">
              <Stack direction="row" alignItems="center" width={180}>
                <Typography marginRight={1}>{label}</Typography>
              </Stack>
              <Switch {...field} checked={!!field.value} />
            </Stack>
          )}
        />
      ))}
    </Stack>
  );
};

export default SettingExpertModeBlock;
