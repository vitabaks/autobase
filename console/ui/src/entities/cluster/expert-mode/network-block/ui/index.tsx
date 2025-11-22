import { FC } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NETWORK_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/network-block/model/const.ts';

const Network: FC = () => {
  const { t } = useTranslation('clusters');

  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Stack gap={1}>
      <Typography fontWeight="bold">{t('network')}</Typography>
      <Typography>{t('networkInfo')}</Typography>
      <Controller
        control={control}
        name={NETWORK_BLOCK_FIELD_NAMES.SERVER_NETWORK}
        render={({ field }) => (
          <TextField
            {...field}
            size="small"
            label={t('serverNetwork')}
            error={!!errors[NETWORK_BLOCK_FIELD_NAMES.SERVER_NETWORK]}
            helperText={errors?.[NETWORK_BLOCK_FIELD_NAMES.SERVER_NETWORK]?.message as string}
          />
        )}
      />
    </Stack>
  );
};

export default Network;
