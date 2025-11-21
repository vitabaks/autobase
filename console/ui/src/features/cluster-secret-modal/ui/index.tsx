import { FC, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Modal,
  Stack,
  TextField,
} from '@mui/material';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CLUSTER_CREATION_TYPES, CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { generateAbsoluteRouterPath, handleRequestErrorCatch } from '@shared/lib/functions.ts';
import RouterPaths from '@app/router/routerPathsConfig';
import { useNavigate } from 'react-router-dom';
import {
  ClusterFormValues,
  ClusterSecretModalFormValues,
  ClusterSecretModalProps,
} from '@features/cluster-secret-modal/model/types.ts';
import { useGetSecretsQuery, usePostSecretsMutation } from '@shared/api/api/secrets.ts';
import {
  CLUSTER_SECRET_MODAL_FORM_DEFAULT_VALUES,
  CLUSTER_SECRET_MODAL_FORM_FIELD_NAMES,
} from '@features/cluster-secret-modal/model/constants.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectCurrentProject } from '@app/redux/slices/projectSlice/projectSelectors.ts';
import { toast } from 'react-toastify';
import { usePostClustersMutation } from '@shared/api/api/clusters.ts';
import SecretFormBlock from '@entities/secret-form-block';

import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';
import { getSecretBodyFromValues } from '@entities/secret-form-block/lib/functions.ts';
import { DATABASE_SERVERS_FIELD_NAMES } from '@entities/cluster/database-servers-block/model/const.ts';
import { mapFormValuesToRequestFields } from '@shared/lib/clusterValuesTransformFunctions.ts';
import { PROVIDERS } from '@shared/config/constants.ts';

const ClusterSecretModal: FC<ClusterSecretModalProps> = ({ isClusterFormDisabled = false, customExtraVars = {} }) => {
  const { t } = useTranslation(['clusters', 'shared', 'toasts']);
  const navigate = useNavigate();
  const currentProject = useAppSelector(selectCurrentProject);
  const createSecretResultRef = useRef(null); // ref is used for case when user saves secret and uses its ID to create cluster

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [addSecretTrigger, addSecretTriggerState] = usePostSecretsMutation();
  const [addClusterTrigger, addClusterTriggerState] = usePostClustersMutation();

  const watchClusterFormValues = useWatch();

  const secrets = useGetSecretsQuery({
    type:
      watchClusterFormValues?.[CLUSTER_FORM_FIELD_NAMES.CREATION_TYPE] === CLUSTER_CREATION_TYPES.YAML
        ? (customExtraVars?.cloud_provider ?? PROVIDERS.LOCAL)
        : watchClusterFormValues?.[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code,
    projectId: currentProject,
  });

  const methods = useForm<ClusterSecretModalFormValues>({
    defaultValues: CLUSTER_SECRET_MODAL_FORM_DEFAULT_VALUES,
  });

  const watchIsSaveToConsole = methods.watch(CLUSTER_SECRET_MODAL_FORM_FIELD_NAMES.IS_SAVE_TO_CONSOLE);

  const handleModalOpenState = (isOpen: boolean) => () => setIsModalOpen(isOpen);

  const cancelHandler = () => navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));

  const onSubmit = async (secretsFields: ClusterSecretModalFormValues) => {
    try {
      if (secretsFields[CLUSTER_SECRET_MODAL_FORM_FIELD_NAMES.IS_SAVE_TO_CONSOLE] && !createSecretResultRef?.current) {
        createSecretResultRef.current = await addSecretTrigger({
          requestSecretCreate: {
            project_id: Number(currentProject),
            type:
              watchClusterFormValues[CLUSTER_FORM_FIELD_NAMES.CREATION_TYPE] === CLUSTER_CREATION_TYPES.YAML
                ? (customExtraVars?.cloud_provider ?? PROVIDERS.LOCAL)
                : watchClusterFormValues[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code,
            name: secretsFields[CLUSTER_SECRET_MODAL_FORM_FIELD_NAMES.SECRET_NAME],
            value: getSecretBodyFromValues({
              ...secretsFields,
              [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_TYPE]:
                watchClusterFormValues[CLUSTER_FORM_FIELD_NAMES.CREATION_TYPE] === CLUSTER_CREATION_TYPES.YAML
                  ? (customExtraVars?.cloud_provider ?? PROVIDERS.LOCAL)
                  : watchClusterFormValues[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code,
            }),
          },
        }).unwrap();
        toast.success(
          t('secretSuccessfullyCreated', {
            ns: 'toasts',
            secretName: secretsFields[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_NAME],
          }),
        );
      }
      await addClusterTrigger({
        requestClusterCreate: mapFormValuesToRequestFields({
          values: watchClusterFormValues as ClusterFormValues,
          secretsInfo: secretsFields,
          projectId: Number(currentProject),
          ...(customExtraVars ? { customExtraVars } : {}),
          ...(!secrets.data?.data?.length && !createSecretResultRef?.current?.id
            ? {
                secretsInfo: secretsFields,
              }
            : {
                secretId: createSecretResultRef.current?.id ?? secretsFields[CLUSTER_FORM_FIELD_NAMES.SECRET_ID],
              }),
        }),
      }).unwrap();
      toast.success(
        t(
          watchClusterFormValues[DATABASE_SERVERS_FIELD_NAMES.IS_CLUSTER_EXISTS]
            ? 'clusterSuccessfullyImported'
            : 'clusterSuccessfullyCreated',
          {
            ns: 'toasts',
            clusterName:
              creationType === CLUSTER_CREATION_TYPES.YAML
                ? customExtraVars?.patroni_cluster_name
                : values[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME],
          },
        ),
      );
      navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));
    } catch (e) {
      handleRequestErrorCatch(e);
    } finally {
      setIsModalOpen(false);
      methods.reset();
    }
  };

  const { isValid, isDirty, isSubmitting } = methods.formState;

  return (
    <Stack direction="row" gap="8px" justifyContent="flex-start" alignItems="center">
      <Button
        disabled={
          isClusterFormDisabled || isSubmitting || addSecretTriggerState.isLoading || addClusterTriggerState.isLoading
        }
        onClick={handleModalOpenState(true)}
        variant="contained"
        startIcon={
          isSubmitting || addSecretTriggerState.isLoading || addClusterTriggerState.isLoading ? (
            <CircularProgress size={16} />
          ) : undefined
        }>
        {t('createCluster', { ns: 'clusters' })}
      </Button>
      <Box>
        <Modal open={isModalOpen} onClose={handleModalOpenState(false)}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Card
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  height: 'max-content',
                  bgcolor: 'background.paper',
                  borderRadius: '3px',
                  p: 4,
                }}>
                <Stack direction="column" gap="8px">
                  {secrets.data?.data?.length > 1 ? (
                    <Controller
                      control={methods.control}
                      name={CLUSTER_FORM_FIELD_NAMES.SECRET_ID}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          select
                          size="small"
                          value={value}
                          onChange={onChange}
                          fullWidth
                          label={t('selectSecret', { ns: 'shared' })}>
                          {secrets.data.data.map((secret) => (
                            <MenuItem key={secret?.id} value={secret?.id}>
                              {secret?.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  ) : (
                    <>
                      <SecretFormBlock
                        secretType={
                          watchClusterFormValues[CLUSTER_FORM_FIELD_NAMES.CREATION_TYPE] === CLUSTER_CREATION_TYPES.YAML
                            ? customExtraVars?.cloud_provider
                            : watchClusterFormValues?.[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code
                        }
                        isAdditionalInfoDisplayed={watchIsSaveToConsole}
                      />
                      {watchIsSaveToConsole ? (
                        <Controller
                          control={methods.control}
                          name={CLUSTER_SECRET_MODAL_FORM_FIELD_NAMES.SECRET_NAME}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              required
                              fullWidth
                              size="small"
                              value={value}
                              onChange={onChange}
                              label={t('secretName', { ns: 'settings' })}
                            />
                          )}
                        />
                      ) : null}
                      <Controller
                        control={methods.control}
                        name={CLUSTER_SECRET_MODAL_FORM_FIELD_NAMES.IS_SAVE_TO_CONSOLE}
                        render={({ field: { value, onChange } }) => (
                          <FormControlLabel
                            control={<Checkbox />}
                            checked={value}
                            onChange={onChange}
                            label={t('saveToConsole', { ns: 'clusters' })}
                          />
                        )}
                      />
                    </>
                  )}
                  <Button
                    disabled={
                      !isValid ||
                      !isDirty ||
                      isSubmitting ||
                      addSecretTriggerState.isLoading ||
                      addClusterTriggerState.isLoading
                    }
                    variant="contained"
                    type="submit"
                    fullWidth={false}
                    startIcon={
                      isSubmitting || addSecretTriggerState.isLoading || addClusterTriggerState.isLoading ? (
                        <CircularProgress size={16} />
                      ) : undefined
                    }>
                    {t('createCluster', { ns: 'clusters' })}
                  </Button>
                </Stack>
              </Card>
            </form>
          </FormProvider>
        </Modal>
      </Box>
      <Button variant="outlined" onClick={cancelHandler} type="button" fullWidth={false}>
        <span>{t('cancel', { ns: 'shared' })}</span>
      </Button>
    </Stack>
  );
};

export default ClusterSecretModal;
