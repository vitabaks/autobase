import React, { useLayoutEffect, useRef, useState } from 'react';
import ProvidersBlock from '@entities/providers-block';
import ClusterFormEnvironmentBlock from '@entities/cluster-form-environment-block';
import ClusterNameBox from '@entities/cluster-form-cluster-name-block';
import ClusterDescriptionBlock from '@entities/cluster-description-block';
import PostgresVersionBox from '@entities/postgres-version-block';
import DefaultFormButtons from '@shared/ui/default-form-buttons';
import { FormProvider, useForm } from 'react-hook-form';
import { generateAbsoluteRouterPath, handleRequestErrorCatch } from '@shared/lib/functions.ts';
import RouterPaths from '@app/router/routerPathsConfig';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGetExternalDeploymentsQuery } from '@shared/api/api/deployments.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import ClusterFormCloudProviderFormPart from '@widgets/cluster-form/ui/ClusterFormCloudProviderFormPart.tsx';
import ClusterFormLocalMachineFormPart from '@widgets/cluster-form/ui/ClusterFormLocalMachineFormPart.tsx';
import { useGetClustersDefaultNameQuery, usePostClustersMutation } from '@shared/api/api/clusters.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectCurrentProject } from '@app/redux/slices/projectSlice/projectSelectors.ts';
import { Stack } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { ClusterFormSchema } from '@widgets/cluster-form/model/validation.ts';
import ClusterSummary from '@widgets/cluster-summary';
import ClusterSecretModal from '@features/cluster-secret-modal';
import { useGetPostgresVersionsQuery } from '@shared/api/api/other.ts';
import { useGetEnvironmentsQuery } from '@shared/api/api/environments.ts';
import { mapFormValuesToRequestFields } from '@features/cluster-secret-modal/lib/functions.ts';
import { toast } from 'react-toastify';
import { AUTHENTICATION_METHODS } from '@shared/model/constants.ts';
import { ClusterFormValues } from '@features/cluster-secret-modal/model/types.ts';
import { useGetSecretsQuery, usePostSecretsMutation } from '@shared/api/api/secrets.ts';
import { getSecretBodyFromValues } from '@entities/secret-form-block/lib/functions.ts';
import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';
import Spinner from '@shared/ui/spinner';

const ClusterForm: React.FC = () => {
  const { t } = useTranslation(['clusters', 'validation', 'toasts']);
  const navigate = useNavigate();
  const createSecretResultRef = useRef(null); // ref is used for case when user saves secret and uses its ID to create cluster

  const [isResetting, setIsResetting] = useState(false);

  const currentProject = useAppSelector(selectCurrentProject);

  const [addSecretTrigger, addSecretTriggerState] = usePostSecretsMutation();
  const [addClusterTrigger, addClusterTriggerState] = usePostClustersMutation();

  const deployments = useGetExternalDeploymentsQuery({ offset: 0, limit: 999_999_999 });
  const environments = useGetEnvironmentsQuery({ offset: 0, limit: 999_999_999 });
  const postgresVersions = useGetPostgresVersionsQuery();
  const clusterName = useGetClustersDefaultNameQuery();

  const methods = useForm<ClusterFormValues>({
    mode: 'all',
    resolver: yupResolver(ClusterFormSchema(t)),
    defaultValues: {
      [CLUSTER_FORM_FIELD_NAMES.INSTANCES_AMOUNT]: 3,
      [CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD]: AUTHENTICATION_METHODS.SSH,
      [CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET]: false,
      [CLUSTER_FORM_FIELD_NAMES.SECRET_ID]: '',
      [CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS]: Array(3)
        .fill(0)
        .map(() => ({
          [CLUSTER_FORM_FIELD_NAMES.HOSTNAME]: '',
          [CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]: '',
          [CLUSTER_FORM_FIELD_NAMES.LOCATION]: '',
        })),
    },
  });

  const watchProvider = methods.watch(CLUSTER_FORM_FIELD_NAMES.PROVIDER);

  const secrets = useGetSecretsQuery({ type: watchProvider?.code, projectId: currentProject });

  useLayoutEffect(() => {
    if (deployments.isFetching || postgresVersions.isFetching || environments.isFetching || clusterName.isFetching)
      setIsResetting(true);
    if (deployments.data?.data && postgresVersions.data?.data && environments.data?.data && clusterName.data) {
      // eslint-disable-next-line @typescript-eslint/require-await
      const resetForm = async () => {
        // sync function will result in form values setting error
        const providers = deployments.data.data;
        methods.reset((values) => ({
          ...values,
          [CLUSTER_FORM_FIELD_NAMES.PROVIDER]: providers?.[0],
          [CLUSTER_FORM_FIELD_NAMES.REGION]: providers?.[0]?.cloud_regions[0]?.code,
          [CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG]: providers?.[0]?.cloud_regions[0]?.datacenters?.[0],
          [CLUSTER_FORM_FIELD_NAMES.INSTANCE_TYPE]: 'small',
          [CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG]: providers?.[0]?.instance_types?.small?.[0],
          [CLUSTER_FORM_FIELD_NAMES.STORAGE_AMOUNT]: 100,
          [CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION]: postgresVersions.data?.data?.at(-1)?.major_version,
          [CLUSTER_FORM_FIELD_NAMES.ENVIRONMENT_ID]: environments.data?.data?.[0]?.id,
          [CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME]: clusterName.data?.name ?? 'postgres-cluster',
        }));
      };
      void resetForm().then(() => setIsResetting(false));
    }
  }, [deployments.data?.data, postgresVersions.data?.data, environments.data?.data, clusterName.data, methods]);

  const submitLocalCluster = async (values: ClusterFormValues) => {
    if (values[CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_IS_SAVE_TO_CONSOLE] && !createSecretResultRef?.current) {
      createSecretResultRef.current = await addSecretTrigger({
        requestSecretCreate: {
          project_id: Number(currentProject),
          type: values[CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD],
          name: values[CLUSTER_FORM_FIELD_NAMES.SECRET_KEY_NAME],
          value: getSecretBodyFromValues({
            ...values,
            [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_TYPE]: values[CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD],
          }),
        },
      }).unwrap();
      toast.success(
        t('secretSuccessfullyCreated', {
          ns: 'toasts',
          secretName: values[CLUSTER_FORM_FIELD_NAMES.SECRET_KEY_NAME],
        }),
      );
    }
    await addClusterTrigger({
      requestClusterCreate: mapFormValuesToRequestFields({
        values,
        secretId: createSecretResultRef.current?.id ?? Number(values[CLUSTER_FORM_FIELD_NAMES.SECRET_ID]),
        projectId: Number(currentProject),
      }),
    }).unwrap();
    toast.info(
      t(
        values[CLUSTER_FORM_FIELD_NAMES.EXISTING_CLUSTER]
          ? 'clusterSuccessfullyImported'
          : 'clusterSuccessfullyCreated',
        {
          ns: 'toasts',
          clusterName: values[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME],
        }
      )
    );
  };

  const submitCloudCluster = async (values: ClusterFormValues) => {
    await addClusterTrigger({
      requestClusterCreate: mapFormValuesToRequestFields({
        values,
        secretId: secrets?.data?.data?.[0]?.id,
        projectId: Number(currentProject),
      }),
    }).unwrap();
    toast.info(
      t(
        values[CLUSTER_FORM_FIELD_NAMES.EXISTING_CLUSTER]
          ? 'clusterSuccessfullyImported'
          : 'clusterSuccessfullyCreated',
        {
          ns: 'toasts',
          clusterName: values[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME],
        }
      )
    );
  };

  const onSubmit = async (values: ClusterFormValues) => {
    try {
      values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code === PROVIDERS.LOCAL
        ? await submitLocalCluster(values)
        : await submitCloudCluster(values);
      navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));
    } catch (e) {
      handleRequestErrorCatch(e);
    }
  };

  const cancelHandler = () => navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));

  const { isValid, isSubmitting } = methods.formState; // spreading is required by React Hook Form to ensure correct form state

  return isResetting || deployments.isFetching || postgresVersions.isFetching || environments.isFetching ? (
    <Spinner />
  ) : (
    <FormProvider {...methods}>
      <Stack direction="column" gap={2} padding="8px">
        <Stack direction="row">
          <form
            style={{ width: '100%' }}
            onSubmit={
              watchProvider?.code !== PROVIDERS.LOCAL && secrets?.data?.data?.length !== 1
                ? undefined
                : methods.handleSubmit(onSubmit)
            }>
            <Stack direction="column" gap={2}>
              <ProvidersBlock providers={deployments.data?.data ?? []} />
              {watchProvider?.code === PROVIDERS.LOCAL ? (
                <ClusterFormLocalMachineFormPart />
              ) : (
                <ClusterFormCloudProviderFormPart />
              )}
              <ClusterFormEnvironmentBlock environments={environments.data?.data ?? []} />
              <ClusterNameBox />
              <ClusterDescriptionBlock />
              <PostgresVersionBox postgresVersions={postgresVersions.data?.data ?? []} />
              {watchProvider?.code !== PROVIDERS.LOCAL && secrets?.data?.data?.length !== 1 ? (
                <ClusterSecretModal isClusterFormDisabled={!isValid} />
              ) : (
                <DefaultFormButtons
                  isDisabled={!isValid}
                  isSubmitting={isSubmitting || addClusterTriggerState.isLoading || addSecretTriggerState.isLoading}
                  cancelHandler={cancelHandler}
                  submitButtonLabel={t('createCluster')}
                />
              )}
            </Stack>
          </form>
          <ClusterSummary />
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default ClusterForm;
