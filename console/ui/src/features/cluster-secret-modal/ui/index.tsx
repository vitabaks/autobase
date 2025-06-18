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
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { generateAbsoluteRouterPath, handleRequestErrorCatch } from '@shared/lib/functions.ts';
import RouterPaths from '@app/router/routerPathsConfig';
import { useNavigate } from 'react-router-dom';
import { ClusterSecretModalFormValues, ClusterSecretModalProps } from '@features/cluster-secret-modal/model/types.ts';
import { LoadingButton } from '@mui/lab';
import { useGetSecretsQuery, usePostSecretsMutation } from '@shared/api/api/secrets.ts';
import { CLUSTER_SECRET_MODAL_FORM_FIELD_NAMES } from '@features/cluster-secret-modal/model/constants.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectCurrentProject } from '@app/redux/slices/projectSlice/projectSelectors.ts';
import { toast } from 'react-toastify';
import { mapFormValuesToRequestFields } from '@features/cluster-secret-modal/lib/functions.ts';
import { usePostClustersMutation } from '@shared/api/api/clusters.ts';
import SecretFormBlock from '@entities/secret-form-block';

import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';
import { getSecretBodyFromValues } from '@entities/secret-form-block/lib/functions.ts';

const ClusterSecretModal: FC<ClusterSecretModalProps> = ({ isClusterFormDisabled = false }) => {
  const { t } = useTranslation(['clusters', 'shared', 'toasts']);
  const navigate = useNavigate();
  const createSecretResultRef = useRef(null); // ref is used for case when user saves secret and uses its ID to create cluster

  const currentProject = useAppSelector(selectCurrentProject);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { watch, getValues } = useFormContext();

  const watchProvider = watch(CLUSTER_FORM_FIELD_NAMES.PROVIDER);

  const secrets = useGetSecretsQuery({ type: watchProvider?.code, projectId: currentProject });

  const [addSecretTrigger, addSecretTriggerState] = usePostSecretsMutation();
  const [addClusterTrigger, addClusterTriggerState] = usePostClustersMutation();

  const methods = useForm<ClusterSecretModalFormValues>();

  const watchIsSaveToConsole = methods.watch(CLUSTER_SECRET_MODAL_FORM_FIELD_NAMES.IS_SAVE_TO_CONSOLE);

  const handleModalOpenState = (isOpen: boolean) => () => setIsModalOpen(isOpen);

  const cancelHandler = () => navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));

  const onSubmit = async (values: ClusterSecretModalFormValues) => {
    const clusterFormValues = getValues();
    try {
      if (values[CLUSTER_SECRET_MODAL_FORM_FIELD_NAMES.IS_SAVE_TO_CONSOLE] && !createSecretResultRef?.current) {
        createSecretResultRef.current = await addSecretTrigger({
          requestSecretCreate: {
            project_id: Number(currentProject),
            type: clusterFormValues[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code,
            name: values[CLUSTER_SECRET_MODAL_FORM_FIELD_NAMES.SECRET_NAME],
            value: getSecretBodyFromValues({
              ...values,
              [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_TYPE]: clusterFormValues.provider.code,
            }),
          },
        }).unwrap();
        toast.success(
          t('secretSuccessfullyCreated', {
            ns: 'toasts',
            secretName: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_NAME],
          }),
        );
      }
      if (!secrets.data?.data?.length && !createSecretResultRef?.current?.id) {
        await addClusterTrigger({
          requestClusterCreate: mapFormValuesToRequestFields({
            values: clusterFormValues,
            envs: values,
            projectId: Number(currentProject),
          }),
        }).unwrap();
      } else {
        await addClusterTrigger({
          requestClusterCreate: mapFormValuesToRequestFields({
            values: clusterFormValues,
            secretId: createSecretResultRef.current?.id ?? values[CLUSTER_FORM_FIELD_NAMES.SECRET_ID],
            projectId: Number(currentProject),
          }),
        }).unwrap();
      }
      toast.success(
        t(
          clusterFormValues[CLUSTER_FORM_FIELD_NAMES.EXISTING_CLUSTER]
            ? 'clusterSuccessfullyImported'
            : 'clusterSuccessfullyCreated',
          {
            ns: 'toasts',
            clusterName: clusterFormValues[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME],
          }
        )
      );
      navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));
    } catch (e) {
      handleRequestErrorCatch(e);
    } finally {
      setIsModalOpen(false);
    }
  };

  const { isValid, isDirty, isSubmitting } = methods.formState;

  return (
    <Stack direction="row" gap="8px" justifyContent="flex-start" alignItems="center">
      <LoadingButton
        disabled={isClusterFormDisabled}
        loading={isSubmitting || addSecretTriggerState.isLoading || addClusterTriggerState.isLoading}
        onClick={handleModalOpenState(true)}
        variant="contained">
        {t('createCluster', { ns: 'clusters' })}
      </LoadingButton>
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
                        secretType={watchProvider?.code}
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
                  <LoadingButton
                    loading={isSubmitting || addSecretTriggerState.isLoading || addClusterTriggerState.isLoading}
                    disabled={!isValid || !isDirty}
                    variant="contained"
                    type="submit"
                    loadingIndicator={<CircularProgress size={24} />}
                    fullWidth={false}>
                    {t('createCluster', { ns: 'clusters' })}
                  </LoadingButton>
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
