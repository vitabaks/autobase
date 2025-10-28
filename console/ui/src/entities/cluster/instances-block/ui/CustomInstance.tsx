import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, TextField } from '@mui/material';
import { INSTANCES_BLOCK_CUSTOM_FORM_VALUES } from '@entities/cluster/instances-block/model/const.ts';

const CustomInstance: FC = () => {
  const { t } = useTranslation('clusters');

  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box>
      <Controller
        control={control}
        name={INSTANCES_BLOCK_CUSTOM_FORM_VALUES.SERVER_TYPE}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label={t('serverType')}
            size="small"
            error={!!errors?.[INSTANCES_BLOCK_CUSTOM_FORM_VALUES.SERVER_TYPE]}
            helperText={errors?.[INSTANCES_BLOCK_CUSTOM_FORM_VALUES.SERVER_TYPE]?.message as string}
          />
        )}
      />
    </Box>
  );
};

export default CustomInstance;
