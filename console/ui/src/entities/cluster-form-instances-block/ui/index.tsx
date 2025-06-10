import { FC } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { Box, Divider, Stack, Tab, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import ClusterFromInstanceConfigBox from '@entities/cluster-instance-config-box';

const CloudFormInstancesBlock: FC = () => {
  const { t } = useTranslation(['clusters', 'sharedVcpu']);
  const { control, watch, setValue } = useFormContext();

  const watchInstanceType = watch(CLUSTER_FORM_FIELD_NAMES.INSTANCE_TYPE);

  const watchProvider = watch(CLUSTER_FORM_FIELD_NAMES.PROVIDER);

  const instances = watchProvider?.instance_types ?? [];

  const handleInstanceTypeChange = (onChange: (...event: any[]) => void) => (_: any, value: string) => {
    onChange(value);
    setValue(CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG, instances?.[value]?.[0]);
  };

  const handleInstanceConfigChange = (onChange: (...event: any[]) => void, value: string) => () => {
    onChange(value);
  };

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('selectInstanceType')}
      </Typography>
      <TabContext value={watchInstanceType as string}>
        <Controller
          control={control}
          name={CLUSTER_FORM_FIELD_NAMES.INSTANCE_TYPE}
          render={({ field: { onChange } }) => {
            return (
              <TabList onChange={handleInstanceTypeChange(onChange)}>
                {Object.entries(instances)?.map(([key, value]) =>
                  value ? <Tab key={key} label={key} value={key} /> : null,
                )}
              </TabList>
            );
          }}
        />
        <Divider />
        <Controller
          control={control}
          name={CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG}
          render={({ field: { onChange, value } }) => {
            return (
              <>
                {Object.entries(instances).map(([key, configs]) => (
                  <TabPanel key={key} value={key} sx={{ paddingX: 0, paddingY: '4px' }}>
                    <Stack spacing={1}>
                      {configs?.map((config) => (
                        <ClusterFromInstanceConfigBox
                          key={config.code}
                          isActive={value?.code === config.code}
                          onClick={handleInstanceConfigChange(onChange, config)}
                          name={
                            config.shared_cpu
                              ? `${config.code} (${t('sharedVcpu', 'Shared vCPU')})`
                              : config.code
                          }
                          cpu={config.cpu}
                          ram={config.ram}
                        />
                      ))}
                    </Stack>
                  </TabPanel>
                ))}
              </>
            );
          }}
        />
      </TabContext>
    </Box>
  );
};

export default CloudFormInstancesBlock;
