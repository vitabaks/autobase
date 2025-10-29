import { FC } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { SSH_KEY_BLOCK_FIELD_NAMES } from '@entities/cluster/ssh-key-block/model/const.ts';

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
        name={SSH_KEY_BLOCK_FIELD_NAMES.SSH_PUBLIC_KEY}
        render={({ field: { value, onChange } }) => (
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={6}
            value={value as string}
            placeholder={t('sshKeyCloudProviderPlaceholder')}
            onChange={onChange}
            error={!!errors[SSH_KEY_BLOCK_FIELD_NAMES.SSH_PUBLIC_KEY]}
            helperText={(errors[SSH_KEY_BLOCK_FIELD_NAMES.SSH_PUBLIC_KEY]?.message as string) ?? ''}
          />
        )}
      />
    </Box>
  );
};

export default ClusterFormSshKeyBlock;
