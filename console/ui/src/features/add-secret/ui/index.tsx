import React, { useState } from 'react';
import { Button, Card, CircularProgress, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { useTranslation } from 'react-i18next';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddSecretFormSchema } from '@features/add-secret/model/validation.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectCurrentProject } from '@app/redux/slices/projectSlice/projectSelectors.ts';
import { usePostSecretsMutation } from '@shared/api/api/secrets.ts';
import { AUTHENTICATION_METHODS } from '@shared/model/constants.ts';
import { toast } from 'react-toastify';
import SecretFormBlock from '@entities/secret-form-block/ui';

import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';
import { SecretFormValues } from '@entities/secret-form-block/model/types.ts';
import { getSecretBodyFromValues } from '@entities/secret-form-block/lib/functions.ts';
import { handleRequestErrorCatch } from '@shared/lib/functions.ts';

const SettingsAddSecret: React.FC = () => {
  const { t } = useTranslation(['settings', 'validation', 'toasts']);
  const currentProject = useAppSelector(selectCurrentProject);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpenState = (isOpen: boolean) => () => setIsModalOpen(isOpen);

  const [postSecretTrigger, postSecretTriggerState] = usePostSecretsMutation();

  const methods = useForm<SecretFormValues>({
    mode: 'all',
    resolver: yupResolver(AddSecretFormSchema(t)),
    defaultValues: {
      [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_TYPE]: '',
      [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_NAME]: '',
    },
  });

  const watchType = methods.watch(SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_TYPE);

  const onSubmit = async (values: SecretFormValues) => {
    try {
      if (currentProject) {
        await postSecretTrigger({
          requestSecretCreate: {
            project_id: Number(currentProject),
            name: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_NAME],
            type: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_TYPE],
            value: getSecretBodyFromValues(values),
          },
        }).unwrap();
        methods.reset();
        toast.success(
          t('secretSuccessfullyCreated', {
            ns: 'toasts',
            secretName: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_NAME],
          }),
        );
        setIsModalOpen(false);
      }
    } catch (e) {
      handleRequestErrorCatch(e);
    }
  };

  const { isValid, isSubmitting } = methods.formState;

  return (
    <>
      <Button onClick={handleModalOpenState(true)} startIcon={<AddBoxOutlinedIcon />} variant="text">
        {t('addSecret', { ns: 'settings' })}
      </Button>
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
                <Typography fontWeight="bold" fontSize={20}>
                  {t('addSecret', { ns: 'settings' })}
                </Typography>
                <Stack direction="row" alignItems="center" gap="8px">
                  <Typography width={'140px'}>{t('secretType', { ns: 'settings' })}</Typography>
                  <Controller
                    control={methods.control}
                    name={SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_TYPE}
                    render={({ field: { value, onChange } }) => (
                      <Select size="small" value={value} onChange={onChange} fullWidth>
                        {[
                          PROVIDERS.AWS,
                          PROVIDERS.GCP,
                          PROVIDERS.AZURE,
                          PROVIDERS.DIGITAL_OCEAN,
                          PROVIDERS.HETZNER,
                          ...Object.values(AUTHENTICATION_METHODS),
                        ].map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Stack>
                <Stack direction="row" alignItems="center" gap="8px">
                  <Typography width={'140px'}>{t('secretName', { ns: 'settings' })}*</Typography>
                  <Controller
                    control={methods.control}
                    name={SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_NAME}
                    render={({ field: { value, onChange } }) => (
                      <TextField required fullWidth size="small" value={value} onChange={onChange} />
                    )}
                  />
                </Stack>
                {watchType ? (
                  <Stack gap={'16px'} alignItems="flex-start">
                    <SecretFormBlock secretType={watchType} isAdditionalInfoDisplayed />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!isValid}
                      fullWidth={false}
                      loadingIndicator={<CircularProgress size={24} />}
                      loading={isSubmitting || postSecretTriggerState.isLoading}>
                      {t('addSecret')}
                    </Button>
                  </Stack>
                ) : null}
              </Stack>
            </Card>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default SettingsAddSecret;
