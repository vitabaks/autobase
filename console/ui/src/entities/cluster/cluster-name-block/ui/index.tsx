import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';

const ClusterFormClusterNameBlock: React.FC = () => {
  const { t } = useTranslation('clusters');
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('clusterName')}*
      </Typography>
      <Controller
        control={control}
        name={CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME}
        render={({ field: { value, onChange } }) => (
          <TextField
            size="small"
            fullWidth
            value={value as string}
            onChange={onChange}
            error={!!errors[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME]}
            helperText={errors[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME]?.message ?? ''}
          />
        )}
      />
    </Box>
  );
};

export default ClusterFormClusterNameBlock;
