import { FC } from 'react';
import { DatabaseServerBlockProps } from '@entities/database-servers-block/model/types.ts';
import { Controller, useFormContext } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { Card, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { FieldError } from 'react-hook-form';

interface ServerErrors {
  [CLUSTER_FORM_FIELD_NAMES.HOSTNAME]?: FieldError;
  [CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]?: FieldError;
  [CLUSTER_FORM_FIELD_NAMES.LOCATION]?: FieldError;
}

const DatabaseServerBox: FC<DatabaseServerBlockProps> = ({ index, onRemove, disabled }) => {
  const { t } = useTranslation(['clusters', 'shared']);
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const serverErrors = (errors[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS] as unknown as ServerErrors[])?.[index];

  return (
    <Card sx={{ position: 'relative', padding: '16px', minWidth: '200px' }}>
      {onRemove && !disabled ? (
        <IconButton sx={{ position: 'absolute', right: '4px', top: '4px', cursor: 'pointer' }} onClick={onRemove}>
          <CloseIcon />
        </IconButton>
      ) : null}
      <Stack direction="column" gap="4px">
        <Typography fontWeight="bold">{`${t('server', { ns: 'clusters' })} ${index + 1}`}</Typography>
        <Controller
          control={control}
          name={`${CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS}.${index}.${CLUSTER_FORM_FIELD_NAMES.HOSTNAME}`}
          render={({ field: { value, onChange } }) => (
            <TextField
              required
              value={value}
              onChange={onChange}
              size="small"
              label={t('hostname', { ns: 'clusters' })}
              error={!!serverErrors?.[CLUSTER_FORM_FIELD_NAMES.HOSTNAME]}
              helperText={serverErrors?.[CLUSTER_FORM_FIELD_NAMES.HOSTNAME]?.message ?? ' '}
              disabled={disabled}
            />
          )}
        />
        <Controller
          control={control}
          name={`${CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS}.${index}.${CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS}`}
          render={({ field: { value, onChange } }) => (
            <TextField
              required
              value={value}
              onChange={onChange}
              size="small"
              label={t('ipAddress', { ns: 'clusters' })}
              error={!!serverErrors?.[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]}
              helperText={serverErrors?.[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]?.message ?? ' '}
              disabled={disabled}
            />
          )}
        />
        <Controller
          control={control}
          name={`${CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS}.${index}.${CLUSTER_FORM_FIELD_NAMES.LOCATION}`}
          render={({ field: { value, onChange } }) => (
            <TextField
              value={value}
              onChange={onChange}
              size="small"
              label={t('location', { ns: 'clusters' })}
              placeholder={t('locationPlaceholder', { ns: 'clusters' })}
              disabled={disabled}
            />
          )}
        />
      </Stack>
    </Card>
  );
};

export default DatabaseServerBox;
