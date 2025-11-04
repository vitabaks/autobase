import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Box, Button, Checkbox, Stack, Tooltip, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  LOAD_BALANCERS_DATABASES_DEFAULT_VALUES,
  LOAD_BALANCERS_FIELD_NAMES,
} from '@entities/cluster/load-balancers-block/model/const.ts';
import { IS_EXPERT_MODE } from '@shared/model/constants.ts';
import AddIcon from '@mui/icons-material/Add';
import LoadBalancersDatabaseBox from '@entities/cluster/load-balancers-block/ui/LoadBalancersDatabaseBox.tsx';

const LoadBalancersBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const { control } = useFormContext();

  const watchIsHaproxyEnabled = useWatch({ name: LOAD_BALANCERS_FIELD_NAMES.IS_HAPROXY_ENABLED });
  const watchIsDeployToDatabases = useWatch({ name: LOAD_BALANCERS_FIELD_NAMES.IS_DEPLOY_TO_DATABASE_SERVERS });

  const { fields, append, remove } = useFieldArray({
    control,
    name: LOAD_BALANCERS_FIELD_NAMES.DATABASES,
  });

  const removeServer = (index: number) => () => remove(index);

  const addServer = () => append(LOAD_BALANCERS_DATABASES_DEFAULT_VALUES);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('loadBalancers')}
      </Typography>
      {[
        {
          fieldName: LOAD_BALANCERS_FIELD_NAMES.IS_HAPROXY_ENABLED,
          label: t('haproxyLoadBalancer'),
          tooltip: t('haproxyLoadBalancerTooltip'),
        },
      ].map(({ fieldName, label, tooltip }) => (
        <Controller
          key={fieldName}
          control={control}
          name={fieldName}
          render={({ field }) => (
            <Stack direction="row" alignItems="center">
              <Stack direction="row" alignItems="center" width={250}>
                <Typography marginRight={1}>{label}</Typography>
                <Tooltip title={tooltip}>
                  <HelpOutlineIcon fontSize="small" />
                </Tooltip>
              </Stack>
              <Checkbox {...field} checked={!!field.value} />
            </Stack>
          )}
        />
      ))}
      {IS_EXPERT_MODE ? (
        watchIsHaproxyEnabled ? (
          <Controller
            control={control}
            name={LOAD_BALANCERS_FIELD_NAMES.IS_DEPLOY_TO_DATABASE_SERVERS}
            render={({ field }) => (
              <Stack direction="row" alignItems="center">
                <Stack direction="row" alignItems="center" width={250}>
                  <Typography marginRight={1}>{t('deployToDatabaseServers')}</Typography>
                  <Tooltip title={t('deployToDatabaseServersTooltip')}>
                    <HelpOutlineIcon fontSize="small" />
                  </Tooltip>
                </Stack>
                <Checkbox {...field} checked={!!field.value} />
              </Stack>
            )}
          />
        ) : null
      ) : null}
      {IS_EXPERT_MODE && watchIsHaproxyEnabled && !watchIsDeployToDatabases ? (
        <Stack direction="column" gap="16px" justifyContent="center" alignItems="flex-start">
          <Box display="flex" gap="16px" flexWrap="wrap" justifyContent="flex-start" alignItems="center">
            {fields.map((field, index) => (
              <LoadBalancersDatabaseBox
                key={field.id}
                index={index}
                {...(index !== 0 ? { remove: removeServer(index) } : {})} // removing entity such way is required to avoid bugs with a wrong element removed
              />
            ))}
          </Box>
          <Button onClick={addServer}>
            <AddIcon />
          </Button>
        </Stack>
      ) : null}
    </Box>
  );
};

export default LoadBalancersBlock;
