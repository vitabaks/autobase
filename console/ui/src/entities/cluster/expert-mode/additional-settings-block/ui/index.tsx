import { ChangeEvent, FC } from 'react';
import { Checkbox, Link, Slider, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/additional-settings-block/model/const.ts';
import { INSTANCES_AMOUNT_BLOCK_VALUES } from '@entities/cluster/instances-amount-block/model/const.ts';
import ErrorBox from '@shared/ui/error-box/ui';
import { ErrorBoundary } from 'react-error-boundary';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';

const AdditionalSettingsBlock: FC = () => {
  const { t } = useTranslation('clusters');

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const watchInstancesAmount = useWatch({ name: INSTANCES_AMOUNT_BLOCK_VALUES.INSTANCES_AMOUNT });
  const watchSyncStandbyNodes = useWatch({ name: ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.SYNC_STANDBY_NODES });
  const watchProvider = useWatch({ name: CLUSTER_FORM_FIELD_NAMES.PROVIDER });

  const handleInputChange = (onChange: (event: ChangeEvent) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    // prevent user from entering more or less than restricted amount in input field
    const { value } = e.target;
    if (value > watchInstancesAmount - 1) {
      e.target.value = watchInstancesAmount - 1;
    }
    if (value < 0) {
      e.target.value = 0;
    }
    onChange(e);
  };

  return (
    <Stack>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('additionalSettings')}
      </Typography>
      <ErrorBoundary fallback={<ErrorBox />}>
        <Stack direction="column" spacing={1} alignItems="flex-start">
          <Controller
            control={control}
            name={ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.SYNC_STANDBY_NODES}
            render={({ field }) => (
              <Stack direction="row" alignItems="center">
                <Stack direction="row" alignItems="center" gap={1} width="250px">
                  <Typography>{t('syncStandbyNodes')}</Typography>
                  <Tooltip title={t('syncStandbyNodesTooltip')}>
                    <HelpOutlineIcon fontSize="small" />
                  </Tooltip>
                </Stack>
                <Stack>
                  <TextField
                    {...field}
                    onChange={handleInputChange(field.onChange)}
                    size="small"
                    error={!!errors?.[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.SYNC_STANDBY_NODES]}
                    helperText={errors?.[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.SYNC_STANDBY_NODES]?.message as string}
                  />
                  <Slider
                    {...field}
                    step={1}
                    min={0}
                    max={watchInstancesAmount - 1}
                    sx={{ paddingTop: 0, marginTop: '-8px' }}
                  />
                </Stack>
              </Stack>
            )}
          />
          {watchSyncStandbyNodes ? (
            <Controller
              control={control}
              name={ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_SYNC_MODE_STRICT}
              render={({ field }) => (
                <Stack direction="row" alignItems="center">
                  <Stack direction="row" alignItems="center" width={250}>
                    <Typography marginRight={1}>{t('syncModeStrict')}</Typography>
                    <Tooltip title={t('syncModeStrictTooltip')}>
                      <HelpOutlineIcon fontSize="small" />
                    </Tooltip>
                  </Stack>
                  <Checkbox {...field} checked={!!field.value} />
                </Stack>
              )}
            />
          ) : null}
          {watchProvider?.code !== PROVIDERS.LOCAL
            ? [
                {
                  fieldName: ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_DB_PUBLIC_ACCESS,
                  label: t('dbPublicAccess'),
                  tooltip: t('dbPublicAccessTooltip'),
                },
                {
                  fieldName: ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_CLOUD_LOAD_BALANCER,
                  label: t('cloudLoadBalancer'),
                  tooltip: t('cloudLoadBalancerTooltip'),
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
              ))
            : null}
          <Controller
            control={control}
            name={ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_NETDATA_MONITORING}
            render={({ field }) => (
              <Stack direction="row" alignItems="center">
                <Stack direction="row" alignItems="center" width={250}>
                  <Typography whiteSpace="pre-line">
                    <Trans i18nKey="netdataMonitoring" t={t}>
                      <Link target="_blank" href={'https://github.com/netdata/netdata'} color="text.secondary" />
                    </Trans>
                  </Typography>
                </Stack>
                <Checkbox {...field} checked={!!field.value} />
              </Stack>
            )}
          />
        </Stack>
      </ErrorBoundary>
    </Stack>
  );
};

export default AdditionalSettingsBlock;
