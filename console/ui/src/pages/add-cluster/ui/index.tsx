import { FC, useEffect, useState } from 'react';
import ClusterForm from '@widgets/cluster-form';
import ClusterSummary from '@widgets/cluster-summary';
import { Box, Divider, Stack, Tab } from '@mui/material';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { ClusterFormValues } from '@features/cluster-secret-modal/model/types.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import { ClusterFormSchema } from '@widgets/cluster-form/model/validation.ts';
import {
  CLUSTER_CREATION_TYPES,
  CLUSTER_FORM_DEFAULT_VALUES,
  CLUSTER_FORM_FIELD_NAMES,
} from '@widgets/cluster-form/model/constants.ts';
import { useTranslation } from 'react-i18next';
import { useGetExternalDeploymentsQuery } from '@shared/api/api/deployments.ts';
import { useGetEnvironmentsQuery } from '@shared/api/api/environments.ts';
import { useGetPostgresVersionsQuery } from '@shared/api/api/other.ts';
import { useGetClustersDefaultNameQuery } from '@shared/api/api/clusters.ts';
import Spinner from '@shared/ui/spinner';
import { STORAGE_BLOCK_FIELDS } from '@entities/cluster/storage-block/model/const.ts';
import { IS_EXPERT_MODE, IS_YAML_ENABLED } from '@shared/model/constants.ts';
import YamlEditorForm from '@widgets/yaml-editor-form/ui';
import { TabContext, TabList, TabPanel } from '@mui/lab';

const AddCluster: FC = () => {
  const { t } = useTranslation(['clusters', 'validation', 'toasts']);
  const [isResetting, setIsResetting] = useState(false);

  const methods = useForm<ClusterFormValues>({
    mode: 'all',
    resolver: yupResolver(ClusterFormSchema(t)),
    defaultValues: CLUSTER_FORM_DEFAULT_VALUES,
  });

  const deployments = useGetExternalDeploymentsQuery({ offset: 0, limit: 999_999_999 });
  const environments = useGetEnvironmentsQuery({ offset: 0, limit: 999_999_999 });
  const postgresVersions = useGetPostgresVersionsQuery();
  const clusterName = useGetClustersDefaultNameQuery();

  const watchClusterCreationType = useWatch({ name: CLUSTER_FORM_FIELD_NAMES.CREATION_TYPE, control: methods.control });

  useEffect(() => {
    if (deployments.data?.data && postgresVersions.data?.data && environments.data?.data && clusterName.data) {
      setIsResetting(true);
      // eslint-disable-next-line @typescript-eslint/require-await
      const resetForm = async () => {
        // sync function will result in form values setting error
        const providers = deployments.data?.data;
        methods.reset((values) => ({
          ...values,
          [CLUSTER_FORM_FIELD_NAMES.PROVIDER]: providers?.[0],
          [CLUSTER_FORM_FIELD_NAMES.REGION]: providers?.[0]?.cloud_regions?.[0]?.code,
          [CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG]: providers?.[0]?.cloud_regions?.[0]?.datacenters?.[0],
          [CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG]: providers?.[0]?.instance_types?.small?.[0],
          [CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION]: postgresVersions.data?.data?.at(-1)?.major_version,
          [CLUSTER_FORM_FIELD_NAMES.ENVIRONMENT_ID]: environments.data?.data?.[0]?.id,
          [CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME]: clusterName.data?.name ?? 'postgres-cluster',
          ...(IS_EXPERT_MODE
            ? {
                [STORAGE_BLOCK_FIELDS.VOLUME_TYPE]:
                  providers?.[0]?.volumes?.find((volume) => volume?.is_default)?.volume_type ??
                  providers?.[0]?.volumes?.[0]?.volume_type,
              }
            : {}),
        }));
      };
      void resetForm().then(() => setIsResetting(false));
    }
  }, [deployments.data?.data, postgresVersions.data?.data, environments.data?.data, clusterName.data]);

  const handleTabChange = (onChange: (...event: any[]) => void) => (_, value: string) => {
    onChange(value);
  };

  const clustersForm = (
    <Stack direction="row">
      <Box width="75vw">
        <ClusterForm
          deploymentsData={deployments.data?.data ?? []}
          environmentsData={environments.data?.data ?? []}
          postgresVersionsData={postgresVersions.data?.data ?? []}
        />
      </Box>
      <ClusterSummary />
    </Stack>
  );

  return (
    <FormProvider {...methods}>
      {isResetting || deployments.isFetching || postgresVersions.isFetching || environments.isFetching ? (
        <Spinner />
      ) : IS_EXPERT_MODE && IS_YAML_ENABLED ? (
        <TabContext value={watchClusterCreationType}>
          <Controller
            name={CLUSTER_FORM_FIELD_NAMES.CREATION_TYPE}
            render={({ field: { onChange } }) => (
              <TabList onChange={handleTabChange(onChange)}>
                {Object.values(CLUSTER_CREATION_TYPES)?.map((value) => (
                  <Tab key={value} label={value} value={value} />
                ))}
              </TabList>
            )}
          />
          <Divider />
          <TabPanel value={CLUSTER_CREATION_TYPES.FORM}>{clustersForm}</TabPanel>
          <TabPanel value={CLUSTER_CREATION_TYPES.YAML}>
            <YamlEditorForm />
          </TabPanel>
        </TabContext>
      ) : (
        clustersForm
      )}
    </FormProvider>
  );
};

export default AddCluster;
