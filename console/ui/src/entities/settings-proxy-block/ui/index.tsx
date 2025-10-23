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
      <Typography whiteSpace="pre-line" fontSize={14}>
        {t('proxyServerInfo')}
      </Typography>
      <Stack gap="8px">
        {[
          {
            fieldName: SETTINGS_FORM_FIELDS_NAMES.HTTP_PROXY,
            label: 'http_proxy',
          },
          { fieldName: SETTINGS_FORM_FIELDS_NAMES.HTTPS_PROXY, label: 'https_proxy' },
        ].map(({ fieldName, label }) => (
          <Controller
            key={fieldName}
            control={control}
            name={fieldName}
            render={({ field }) => (
              <Stack direction="row" gap="16px" alignItems="center">
                <Typography width="90px">{label}</Typography>
                <TextField {...field} size="small" />
              </Stack>
            )}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default SettingsProxyBlock;
