import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { Stack, TextField, Typography } from '@mui/material';
import { INSTANCES_BLOCK_FIELD_NAMES } from '@entities/cluster/instances-block/model/const.ts';

const CustomInstance: FC = () => {
  const { t } = useTranslation('clusters');

  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Stack gap={1}>
      <Typography>{t('customInstanceTypeInfo')}</Typography>
      <Controller
        control={control}
        name={INSTANCES_BLOCK_FIELD_NAMES.SERVER_TYPE}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label={t('serverType')}
            size="small"
            error={!!errors?.[INSTANCES_BLOCK_FIELD_NAMES.SERVER_TYPE]}
            helperText={errors?.[INSTANCES_BLOCK_FIELD_NAMES.SERVER_TYPE]?.message as string}
          />
        )}
      />
    </Stack>
  );
};

export default CustomInstance;
