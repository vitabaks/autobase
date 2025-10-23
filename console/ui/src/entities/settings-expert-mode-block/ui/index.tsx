import { FC } from 'react';
import { FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { SETTINGS_FORM_FIELDS_NAMES } from '@entities/settings-proxy-block/model/constants.ts';
import { useTranslation } from 'react-i18next';

const SettingExpertModeBlock: FC = () => {
  const { t } = useTranslation('settings');

  const { control } = useFormContext();

  return (
    <Stack gap={1}>
      <Typography fontWeight="bold" fontSize={16}>
        {t('expertMode')}
      </Typography>
      <Controller
        control={control}
        name={SETTINGS_FORM_FIELDS_NAMES.IS_EXPERT_MODE_ENABLED}
        render={({ field }) => (
          <FormControlLabel
            sx={{
              marginLeft: 0,
            }}
            {...field}
            checked={!!field.value}
            labelPlacement="start"
            control={<Switch />}
            label={t('enableExpertMode')}
          />
        )}
      />
    </Stack>
  );
};

export default SettingExpertModeBlock;
