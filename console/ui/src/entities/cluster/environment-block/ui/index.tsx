import { FC } from 'react';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { EnvironmentBlockProps } from '@entities/cluster/environment-block/model/types.ts';

const ClusterFormEnvironmentBlock: FC<EnvironmentBlockProps> = ({ environments }) => {
  const { t } = useTranslation('shared');
  const { control } = useFormContext();

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('environment')}
      </Typography>
      <Controller
        control={control}
        name={CLUSTER_FORM_FIELD_NAMES.ENVIRONMENT_ID}
        render={({ field: { value, onChange } }) => (
          <Select size="small" value={value} onChange={onChange} fullWidth>
            {environments?.map((environment) => (
              <MenuItem key={environment?.id} value={environment?.id}>
                {environment?.name}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </Box>
  );
};

export default ClusterFormEnvironmentBlock;
