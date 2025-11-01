import React, { FC } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';

const VipAddressBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('clusterVipAddress')}
      </Typography>
      <Controller
        control={control}
        name={CLUSTER_FORM_FIELD_NAMES.CLUSTER_VIP_ADDRESS}
        render={({ field: { value, onChange } }) => (
          <TextField
            fullWidth
            value={value}
            onChange={onChange}
            error={!!errors[CLUSTER_FORM_FIELD_NAMES.CLUSTER_VIP_ADDRESS]}
            helperText={errors[CLUSTER_FORM_FIELD_NAMES.CLUSTER_VIP_ADDRESS]?.message ?? ''}
            size="small"
            placeholder={t('clusterVipAddressPlaceholder')}
          />
        )}
      />
    </Box>
  );
};

export default VipAddressBlock;
