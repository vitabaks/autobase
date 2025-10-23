import React, { lazy, useRef } from 'react';
import ProvidersBlock from '@entities/providers-block';
import ClusterFormEnvironmentBlock from '@entities/cluster-form-environment-block';
import ClusterNameBox from '@entities/cluster-form-cluster-name-block';
import ClusterDescriptionBlock from '@entities/cluster-description-block';
import PostgresVersionBox from '@entities/postgres-version-block';
import DefaultFormButtons from '@shared/ui/default-form-buttons';
import { useFormContext } from 'react-hook-form';
import { generateAbsoluteRouterPath, handleRequestErrorCatch } from '@shared/lib/functions.ts';
import RouterPaths from '@app/router/routerPathsConfig';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import ClusterFormCloudProviderFormPart from '@widgets/cluster-form/ui/ClusterFormCloudProviderFormPart.tsx';
import ClusterFormLocalMachineFormPart from '@widgets/cluster-form/ui/ClusterFormLocalMachineFormPart.tsx';
import { usePostClustersMutation } from '@shared/api/api/clusters.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectCurrentProject } from '@app/redux/slices/projectSlice/projectSelectors.ts';
import { Stack } from '@mui/material';
import ClusterSecretModal from '@features/cluster-secret-modal';
import { mapFormValuesToRequestFields } from '@features/cluster-secret-modal/lib/functions.ts';
import { toast } from 'react-toastify';
import { IS_EXPERT_MODE } from '@shared/model/constants.ts';
import { ClusterFormValues } from '@features/cluster-secret-modal/model/types.ts';
import { useGetSecretsQuery, usePostSecretsMutation } from '@shared/api/api/secrets.ts';
import { getSecretBodyFromValues } from '@entities/secret-form-block/lib/functions.ts';
import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';
import { ClusterFormProps } from '@widgets/cluster-form/model/types.ts';

const DatabaseBlock = lazy(() => import('@entities/databases-block/ui'));
const ConnectionPoolsBlock = lazy(() => import('@entities/connection-pools-block/ui'));
const ExtensionsBlock = lazy(() => import('@entities/extensions-block/ui'));
const BackupsBlock = lazy(() => import('@entities/backups-block/ui'));
const PostgresParametersBlock = lazy(() => import('@entities/postgres-parameters-block/ui'));
const KernelParametersBlock = lazy(() => import('@entities/kernel-parameters-block/ui'));
const AdditionalSettingsBlock = lazy(() => import('@entities/additional-settings-block/ui'));

const ClusterForm: React.FC<ClusterFormProps> = ({
  deploymentsData = [],
  environmentsData = [],
  postgresVersionsData = [],
}) => {
  const { t } = useTranslation(['clusters', 'validation', 'toasts']);
  const navigate = useNavigate();
  const createSecretResultRef = useRef(null); // ref is used for case when user saves secret and uses its ID to create cluster

  const currentProject = useAppSelector(selectCurrentProject);

  const [addSecretTrigger, addSecretTriggerState] = usePostSecretsMutation();
  const [addClusterTrigger, addClusterTriggerState] = usePostClustersMutation();

  const methods = useFormContext();

  const watchProvider = methods.watch(CLUSTER_FORM_FIELD_NAMES.PROVIDER);

  const secrets = useGetSecretsQuery({ type: watchProvider?.code, projectId: currentProject });

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
        },
      ),
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
        },
      ),
    );
  };

  const onSubmit = async (values: ClusterFormValues) => {
    try {
      if (values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code === PROVIDERS.LOCAL) await submitLocalCluster(values);
      else await submitCloudCluster(values);
      await navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));
    } catch (e) {
      handleRequestErrorCatch(e);
    }
  };

  const cancelHandler = () => navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));

  const { isValid, isSubmitting } = methods.formState; // spreading is required by React Hook Form to ensure the correct form state

  return (
    <Stack direction="column" gap={2} padding="8px">
      <form
        onSubmit={
          watchProvider?.code !== PROVIDERS.LOCAL && secrets?.data?.data?.length !== 1
            ? undefined
            : methods.handleSubmit(onSubmit)
        }>
        <Stack direction="column" gap={2}>
          <ProvidersBlock providers={deploymentsData} />
          {watchProvider?.code === PROVIDERS.LOCAL ? (
            <ClusterFormLocalMachineFormPart />
          ) : (
            <ClusterFormCloudProviderFormPart />
          )}
          <ClusterFormEnvironmentBlock environments={environmentsData} />
          <ClusterNameBox />
          <ClusterDescriptionBlock />
          <PostgresVersionBox postgresVersions={postgresVersionsData} />
          {IS_EXPERT_MODE ? (
            <>
              <DatabaseBlock />
              <ConnectionPoolsBlock />
              <ExtensionsBlock />
              <BackupsBlock />
              <PostgresParametersBlock />
              <KernelParametersBlock />
              <AdditionalSettingsBlock />
            </>
          ) : null}
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
    </Stack>
  );
};

export default ClusterForm;
