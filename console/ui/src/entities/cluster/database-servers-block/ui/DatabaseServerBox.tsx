import { FC } from 'react';
import { DatabaseServerBlockProps } from '@entities/cluster/database-servers-block/model/types.ts';
import { Controller, useFormContext } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { Card, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';

const DatabaseServerBox: FC<DatabaseServerBlockProps> = ({ index, remove }) => {
  const { t } = useTranslation(['clusters', 'shared']);
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Card sx={{ position: 'relative', padding: '16px', minWidth: '200px' }}>
      {remove ? (
        <IconButton sx={{ position: 'absolute', right: '4px', top: '4px', cursor: 'pointer' }} onClick={remove}>
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
              error={!!errors[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS]?.[index]?.[CLUSTER_FORM_FIELD_NAMES.HOSTNAME]}
              helperText={
                errors?.[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS]?.[index]?.[CLUSTER_FORM_FIELD_NAMES.HOSTNAME]
                  ?.message ?? ' '
              }
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
              error={
                !!errors[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS]?.[index]?.[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]
              }
              helperText={
                errors?.[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS]?.[index]?.[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]
                  ?.message ?? ' '
              }
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
            />
          )}
        />
      </Stack>
    </Card>
  );
};

export default DatabaseServerBox;
