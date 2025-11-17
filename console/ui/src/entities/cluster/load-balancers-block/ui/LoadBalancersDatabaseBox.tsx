import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Card, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { LOAD_BALANCERS_FIELD_NAMES } from '@entities/cluster/load-balancers-block/model/const.ts';
import { LoadBalancersDatabaseBoxProps } from '@entities/cluster/load-balancers-block/model/types.ts';

const LoadBalancersDatabaseBox: FC<LoadBalancersDatabaseBoxProps> = ({ index, remove }) => {
  const { t } = useTranslation('clusters');
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
        <Typography fontWeight="bold">{`${t('server')} ${index + 1}`}</Typography>
        <Controller
          control={control}
          name={`${LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES}.${index}.${LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES_HOSTNAME}`}
          render={({ field }) => (
            <TextField
              {...field}
              required
              size="small"
              label={t('hostname')}
              error={
                !!errors[LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES]?.[index]?.[
                  LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES_HOSTNAME
                ]
              }
              helperText={
                errors?.[LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES]?.[index]?.[
                  LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES_HOSTNAME
                ]?.message as string
              }
            />
          )}
        />
        <Controller
          control={control}
          name={`${LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES}.${index}.${LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES_IP_ADDRESS}`}
          render={({ field }) => (
            <TextField
              {...field}
              required
              size="small"
              label={t('ipAddress')}
              error={
                !!errors[LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES]?.[index]?.[
                  LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES_IP_ADDRESS
                ]
              }
              helperText={
                errors?.[LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES]?.[index]?.[
                  LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES_IP_ADDRESS
                ]?.message as string
              }
            />
          )}
        />
      </Stack>
    </Card>
  );
};

export default LoadBalancersDatabaseBox;
