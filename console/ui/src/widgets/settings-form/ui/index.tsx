import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SettingsFormValues } from '@entities/settings-proxy-block/model/types.ts';
import { Box, Button, CircularProgress, Stack } from '@mui/material';
import SettingsProxyBlock from '@entities/settings-proxy-block';
import { useTranslation } from 'react-i18next';
import { SETTINGS_FORM_FIELDS_NAMES } from '@entities/settings-proxy-block/model/constants.ts';
import {
  useGetSettingsQuery,
  usePatchSettingsByNameMutation,
  usePostSettingsMutation,
} from '@shared/api/api/settings.ts';
import { toast } from 'react-toastify';
import { handleRequestErrorCatch } from '@shared/lib/functions.ts';
import Spinner from '@shared/ui/spinner';
import SettingExpertModeBlock from '@entities/settings-expert-mode-block/ui';
import { LOCAL_STORAGE_ITEMS } from '@shared/model/constants.ts';

const SettingsForm: FC = () => {
  const { t } = useTranslation(['shared', 'toasts']);

  const [isResetting, setIsResetting] = useState(false);

  const methods = useForm<SettingsFormValues>({
    mode: 'all',
    defaultValues: {
      [SETTINGS_FORM_FIELDS_NAMES.HTTP_PROXY]: '',
      [SETTINGS_FORM_FIELDS_NAMES.HTTPS_PROXY]: '',
      [SETTINGS_FORM_FIELDS_NAMES.IS_EXPERT_MODE_ENABLED]:
        localStorage.getItem(LOCAL_STORAGE_ITEMS.IS_EXPERT_MODE)?.toString() === 'true',
    },
  });

  const settings = useGetSettingsQuery({ offset: 0, limit: 999_999_999 });
  const [postSettingsTrigger, postSettingsTriggerState] = usePostSettingsMutation();
  const [patchSettingsTrigger, patchSettingsTriggerState] = usePatchSettingsByNameMutation();

  const { isValid, isDirty } = methods.formState;

  useEffect(() => {
    if (settings.data?.data) {
      setIsResetting(true);
      // eslint-disable-next-line @typescript-eslint/require-await
      const resetForm = async () => {
        // sync function will result in form values setting error
        const settingsData = settings.data?.data?.find((value) => value.name === 'proxy_env')?.value;
        methods.reset((values) => ({
          ...values,
          ...settingsData,
        }));
      };
      void resetForm().then(() => setIsResetting(false));
    }
  }, [settings.data?.data, methods]);

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      const dirtyFields = methods.formState.dirtyFields;
      if (dirtyFields[SETTINGS_FORM_FIELDS_NAMES.IS_EXPERT_MODE_ENABLED]) {
        localStorage.setItem(
          LOCAL_STORAGE_ITEMS.IS_EXPERT_MODE,
          String(values[SETTINGS_FORM_FIELDS_NAMES.IS_EXPERT_MODE_ENABLED]),
        );
        dispatchEvent(new Event('storage'));
      }
      if (
        dirtyFields?.[SETTINGS_FORM_FIELDS_NAMES.HTTP_PROXY] ||
        dirtyFields?.[SETTINGS_FORM_FIELDS_NAMES.HTTPS_PROXY]
      ) {
        const filledFormValues = Object.fromEntries(
          Object.entries(values).filter(
            ([key, value]) => value !== '' && key !== SETTINGS_FORM_FIELDS_NAMES.IS_EXPERT_MODE_ENABLED,
          ),
        );
        if (settings.data?.data?.find((value) => value?.name === 'proxy_env')?.value && isDirty)
          await patchSettingsTrigger({
            name: 'proxy_env',
            requestChangeSetting: { value: { ...filledFormValues } },
          }).unwrap();
        else
          await postSettingsTrigger({
            requestCreateSetting: {
              name: 'proxy_env',
              value: { ...filledFormValues },
            },
          }).unwrap();
        toast.success(t('settingsSuccessfullyChanged', { ns: 'toasts' }));
      }
      methods.reset(values);
    } catch (e) {
      handleRequestErrorCatch(e);
    }
  };

  return (
    <Box margin="8px">
      {isResetting || settings.isFetching ? (
        <Spinner />
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Stack direction="column" gap={2} alignItems="flex-start" justifyContent="center">
              <SettingsProxyBlock />
              <SettingExpertModeBlock />
              <Button
                type="submit"
                variant="contained"
                disabled={
                  !isDirty || !isValid || postSettingsTriggerState.isLoading || patchSettingsTriggerState.isLoading
                }
                startIcon={
                  postSettingsTriggerState.isLoading || patchSettingsTriggerState.isLoading ? (
                    <CircularProgress size={16} />
                  ) : undefined
                }>
                {t('save')}
              </Button>
            </Stack>
          </form>
        </FormProvider>
      )}
    </Box>
  );
};

export default SettingsForm;
