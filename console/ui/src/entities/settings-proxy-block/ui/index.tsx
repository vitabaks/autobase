import React from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { SETTINGS_FORM_FIELDS_NAMES } from '@entities/settings-proxy-block/model/constants.ts';

const SettingsProxyBlock: React.FC = () => {
  const { t } = useTranslation('settings');

  const { control } = useFormContext();

  return (
    <Stack gap="8px">
      <Typography fontWeight="bold" fontSize={16}>
        {t('proxyServer')}
      </Typography>
      <Typography whiteSpace="pre-line" fontSize={14}>{t('proxyServerInfo')}</Typography>
      <Stack gap="8px">
        <Controller
          control={control}
          name={SETTINGS_FORM_FIELDS_NAMES.HTTP_PROXY}
          render={({ field: { value, onChange } }) => (
            <Stack direction="row" gap="16px" alignItems="center">
              <Typography width="90px">http_proxy</Typography>
              <TextField size="small" value={value} onChange={onChange} />
            </Stack>
          )}
        />
        <Controller
          control={control}
          name={SETTINGS_FORM_FIELDS_NAMES.HTTPS_PROXY}
          render={({ field: { value, onChange } }) => (
            <Stack direction="row" gap="16px" alignItems="center">
              <Typography width="90px">https_proxy</Typography>
              <TextField size="small" value={value} onChange={onChange} />
            </Stack>
          )}
        />
      </Stack>
    </Stack>
  );
};

export default SettingsProxyBlock;
