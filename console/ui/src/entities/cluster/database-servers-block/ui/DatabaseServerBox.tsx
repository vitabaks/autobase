import { FC } from 'react';
import { DatabaseServerBlockProps } from '@entities/cluster/database-servers-block/model/types.ts';
import { Controller, useFormContext } from 'react-hook-form';
import { Card, Checkbox, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { DATABASE_SERVERS_FIELD_NAMES } from '@entities/cluster/database-servers-block/model/const.ts';
import { IS_EXPERT_MODE } from '@shared/model/constants.ts';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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
      <Stack direction="column" gap={1}>
        <Typography fontWeight="bold">{`${t('server', { ns: 'clusters' })} ${index + 1}`}</Typography>
        <Controller
          control={control}
          name={`${DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS}.${index}.${DATABASE_SERVERS_FIELD_NAMES.DATABASE_HOSTNAME}`}
          render={({ field: { value, onChange } }) => (
            <TextField
              required
              value={value}
              onChange={onChange}
              size="small"
              label={t('hostname', { ns: 'clusters' })}
              error={
                !!errors[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS]?.[index]?.[
                  DATABASE_SERVERS_FIELD_NAMES.DATABASE_HOSTNAME
                ]
              }
              helperText={
                errors?.[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS]?.[index]?.[
                  DATABASE_SERVERS_FIELD_NAMES.DATABASE_HOSTNAME
                ]?.message ?? ' '
              }
            />
          )}
        />
        <Controller
          control={control}
          name={`${DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS}.${index}.${DATABASE_SERVERS_FIELD_NAMES.DATABASE_IP_ADDRESS}`}
          render={({ field: { value, onChange } }) => (
            <TextField
              required
              value={value}
              onChange={onChange}
              size="small"
              label={t('ipAddress', { ns: 'clusters' })}
              error={
                !!errors[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS]?.[index]?.[
                  DATABASE_SERVERS_FIELD_NAMES.DATABASE_IP_ADDRESS
                ]
              }
              helperText={
                errors?.[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS]?.[index]?.[
                  DATABASE_SERVERS_FIELD_NAMES.DATABASE_IP_ADDRESS
                ]?.message ?? ' '
              }
            />
          )}
        />
        <Controller
          control={control}
          name={`${DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS}.${index}.${DATABASE_SERVERS_FIELD_NAMES.DATABASE_LOCATION}`}
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
        {IS_EXPERT_MODE ? (
          <Controller
            control={control}
            name={`${DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS}.${index}.${DATABASE_SERVERS_FIELD_NAMES.IS_POSTGRESQL_EXISTS}`}
            render={({ field }) => (
              <Stack direction="row" alignItems="center">
                <Stack direction="row" alignItems="center">
                  <Typography marginRight={1}>{t('isPostgresqlExists')}</Typography>
                  <Tooltip title={t('isPostgresqlExistsTooltip')}>
                    <HelpOutlineIcon fontSize="small" />
                  </Tooltip>
                </Stack>
                <Checkbox {...field} checked={!!field.value} />
              </Stack>
            )}
          />
        ) : null}
      </Stack>
    </Card>
  );
};

export default DatabaseServerBox;
