import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SettingsFormValues } from '@entities/settings-proxy-block/model/types.ts';
import { Box, Stack, Button } from '@mui/material';
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

const SettingsForm: FC = () => {
  const { t } = useTranslation(['shared', 'toasts']);

  const [isResetting, setIsResetting] = useState(false);

  const methods = useForm<SettingsFormValues>({
    mode: 'all',
    defaultValues: {
      [SETTINGS_FORM_FIELDS_NAMES.HTTP_PROXY]: '',
      [SETTINGS_FORM_FIELDS_NAMES.HTTPS_PROXY]: '',
    },
  });

  const settings = useGetSettingsQuery({ offset: 0, limit: 999_999_999 });
  const [postSettingsTrigger, postSettingsTriggerState] = usePostSettingsMutation();
  const [patchSettingsTrigger, patchSettingsTriggerState] = usePatchSettingsByNameMutation();

  const { isValid, isDirty } = methods.formState;

  useEffect(() => {
    if (settings.isFetching) setIsResetting(true);
    if (settings.data?.data) {
      // eslint-disable-next-line @typescript-eslint/require-await
      const resetForm = async () => {
        // sync function will result in form values setting error
        const settingsData = settings.data.data?.find((value) => value.name === 'proxy_env')?.value;
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
      const filledFormValues = Object.fromEntries(Object.entries(values).filter(([_, value]) => value !== ''));
      settings.data?.data?.find((value) => value?.name === 'proxy_env')?.value && isDirty
        ? await patchSettingsTrigger({
            name: 'proxy_env',
            requestChangeSetting: { value: { ...filledFormValues } },
          }).unwrap()
        : await postSettingsTrigger({
            requestCreateSetting: {
              name: 'proxy_env',
              value: { ...filledFormValues },
            },
          }).unwrap();
      toast.success(t('settingsSuccessfullyChanged', { ns: 'toasts' }));
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
              <Button
                type="submit"
                variant="contained"
                disabled={!isDirty || !isValid}
                loading={postSettingsTriggerState.isLoading || patchSettingsTriggerState.isLoading}>
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
