import { FC, SyntheticEvent } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { Box, Divider, Stack, Tab, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import ClusterFormRegionConfigBox from '@widgets/cluster-form/ui/ClusterFormRegionConfigBox.tsx';

const CloudFormRegionBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const { control, watch, setValue } = useFormContext();

  const watchProvider = watch(CLUSTER_FORM_FIELD_NAMES.PROVIDER);
  const regionWatch = watch(CLUSTER_FORM_FIELD_NAMES.REGION);

  const regions = watchProvider?.cloud_regions ?? [];

  const handleRegionChange =
    (onChange: (...event: never[]) => void) => (e: SyntheticEvent<Element, Event>, value: string) => {
      onChange(value);
      setValue(
        CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG,
        regions?.find((region) => region.code === value)?.datacenters?.[0],
      );
    };

  const handleRegionConfigChange = (onChange: (...event: never[]) => void, value: string) => () => {
    onChange(value);
  };

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('selectCloudRegion')}
      </Typography>
      <TabContext value={regionWatch as string}>
        <Controller
          control={control}
          name={CLUSTER_FORM_FIELD_NAMES.REGION}
          render={({ field: { onChange } }) => {
            return (
              <TabList onChange={handleRegionChange(onChange)}>
                {regions.map((region) => (
                  <Tab key={region.code} label={region.name} value={region.code} />
                ))}
              </TabList>
            );
          }}
        />
        <Divider />
        <Controller
          control={control}
          name={CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG}
          render={({ field: { onChange, value } }) => {
            return (
              <>
                {regions.map((region) => (
                  <TabPanel key={region.code} value={region.code} sx={{ paddingX: 0, paddingY: '4px' }}>
                    <Stack spacing={1}>
                      {region.datacenters.map((config) => (
                        <ClusterFormRegionConfigBox
                          key={config.code}
                          isActive={value?.code === config.code}
                          onClick={handleRegionConfigChange(onChange, config)}
                          name={config.code}
                          place={config.location}
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

export default CloudFormRegionBlock;
