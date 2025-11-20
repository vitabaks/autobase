import { ClusterFormValues } from '@features/cluster-secret-modal/model/types.ts';
import { CLUSTER_CREATION_TYPES, CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { getSecretBodyFromValues } from '@entities/secret-form-block/lib/functions.ts';
import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';
import { toast } from 'react-toastify';
import { mapFormValuesToRequestFields } from '@shared/lib/clusterValuesTransformFunctions.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import { DATABASE_SERVERS_FIELD_NAMES } from '@entities/cluster/database-servers-block/model/const.ts';
import { generateAbsoluteRouterPath, handleRequestErrorCatch } from '@shared/lib/functions.ts';
import RouterPaths from '@app/router/routerPathsConfig';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GetSecretsApiResponse, usePostSecretsMutation } from '@shared/api/api/secrets.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectCurrentProject } from '@app/redux/slices/projectSlice/projectSelectors.ts';
import { useRef } from 'react';
import { usePostClustersMutation } from '@shared/api/api/clusters.ts';

export const useFormSubmit: ({
  secrets,
}: {
  secrets: GetSecretsApiResponse;
}) => [
  boolean,
  ({
    values,
    customExtraVars,
  }: {
    values: ClusterFormValues;
    customExtraVars?: Record<string, never>;
  }) => Promise<void>,
] = (secrets) => {
  const { t } = useTranslation('clusters');
  const navigate = useNavigate();
  const currentProject = useAppSelector(selectCurrentProject);
  const createSecretResultRef = useRef(null); // ref is used for a case when user saves secret and uses its ID to create a cluster

  const [addSecretTrigger, addSecretTriggerState] = usePostSecretsMutation();
  const [addClusterTrigger, addClusterTriggerState] = usePostClustersMutation();

  const submitLocalCluster = async ({
    values,
    customExtraVars,
  }: {
    values: ClusterFormValues;
    customExtraVars?: Record<string, never>;
  }) => {
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
        secretId: createSecretResultRef.current?.id ?? Number(values[CLUSTER_FORM_FIELD_NAMES.SECRET_ID]),
        projectId: Number(currentProject),
        values,
        ...(customExtraVars ? { customExtraVars } : {}),
      }),
    }).unwrap();
  };

  const submitCloudCluster = async ({
    values,
    customExtraVars,
  }: {
    values: ClusterFormValues;
    customExtraVars?: Record<string, never>;
  }) => {
    await addClusterTrigger({
      requestClusterCreate: mapFormValuesToRequestFields({
        secretId: secrets?.data?.[0]?.id,
        projectId: Number(currentProject),
        values,
        ...(customExtraVars ? { customExtraVars } : {}),
      }),
    }).unwrap();
  };

  const onSubmit = async ({
    values,
    customExtraVars,
  }: {
    values: ClusterFormValues;
    customExtraVars?: Record<string, never>;
  }) => {
    try {
      if (
        (values[CLUSTER_FORM_FIELD_NAMES.CREATION_TYPE] === CLUSTER_CREATION_TYPES.YAML &&
          customExtraVars?.cloud_provider) ||
        (values[CLUSTER_FORM_FIELD_NAMES.CREATION_TYPE] === CLUSTER_CREATION_TYPES.FORM &&
          values?.[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code !== PROVIDERS.LOCAL)
      )
        await submitCloudCluster({
          values,
          ...(customExtraVars ? { customExtraVars } : {}),
        });
      else
        await submitLocalCluster({
          values,
          ...(customExtraVars ? { customExtraVars } : {}),
        });
      toast.info(
        t(
          values[DATABASE_SERVERS_FIELD_NAMES.IS_CLUSTER_EXISTS]
            ? 'clusterSuccessfullyImported'
            : 'clusterSuccessfullyCreated',
          {
            ns: 'toasts',
            clusterName: values[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME],
          },
        ),
      );
      await navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));
    } catch (e) {
      handleRequestErrorCatch(e);
    }
  };

  return [addSecretTriggerState.isLoading || addClusterTriggerState.isLoading, onSubmit];
};
