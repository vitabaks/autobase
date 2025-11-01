import { FC, useEffect } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { DATA_DIRECTORY_FIELD_NAMES } from '@entities/cluster/expert-mode/data-directory-block/model/const.ts';
import { useTranslation } from 'react-i18next';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';

const DataDirectoryBlock: FC = () => {
  const { t } = useTranslation('clusters');

  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const watchPostgresVersion = useWatch({ name: CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION });

  useEffect(() => {
    setValue(DATA_DIRECTORY_FIELD_NAMES.DATA_DIRECTORY, `/pgdata/${watchPostgresVersion ?? 18}/main`);
  }, [watchPostgresVersion]);

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('dataDirectory')}
      </Typography>
      <Controller
        control={control}
        name={DATA_DIRECTORY_FIELD_NAMES.DATA_DIRECTORY}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            placeholder={t('dataDirectoryPlaceholder')}
            size="small"
            error={!!errors[DATA_DIRECTORY_FIELD_NAMES.DATA_DIRECTORY]}
            helperText={errors[DATA_DIRECTORY_FIELD_NAMES.DATA_DIRECTORY]?.message as string}
          />
        )}
      />
    </Box>
  );
};

export default DataDirectoryBlock;
