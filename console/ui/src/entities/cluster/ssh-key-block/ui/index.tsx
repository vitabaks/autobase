import { FC } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';

const ClusterFormSshKeyBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('sshPublicKey')}*
      </Typography>
      <Controller
        control={control}
        name={CLUSTER_FORM_FIELD_NAMES.SSH_PUBLIC_KEY}
        render={({ field: { value, onChange } }) => (
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={6}
            value={value as string}
            placeholder={t('sshKeyCloudProviderPlaceholder')}
            onChange={onChange}
            error={!!errors[CLUSTER_FORM_FIELD_NAMES.SSH_PUBLIC_KEY]}
            helperText={(errors[CLUSTER_FORM_FIELD_NAMES.SSH_PUBLIC_KEY]?.message as string) ?? ''}
          />
        )}
      />
    </Box>
  );
};

export default ClusterFormSshKeyBlock;
