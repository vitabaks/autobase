import { FC } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DATA_DISK_STORAGE_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/data-disk-storage-block/model/const.ts';

const DataDiskStorage: FC = () => {
  const { t } = useTranslation('clusters');

  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Stack>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('network')}
      </Typography>
      <Controller
        control={control}
        name={DATA_DISK_STORAGE_BLOCK_FIELD_NAMES.SERVER_NETWORK}
        render={({ field }) => (
          <TextField
            {...field}
            size="small"
            label={t('serverNetwork')}
            error={!!errors[DATA_DISK_STORAGE_BLOCK_FIELD_NAMES.SERVER_NETWORK]}
            helperText={errors?.[DATA_DISK_STORAGE_BLOCK_FIELD_NAMES.SERVER_NETWORK]?.message as string}
          />
        )}
      />
    </Stack>
  );
};

export default DataDiskStorage;
