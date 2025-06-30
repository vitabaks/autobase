import React, { useEffect } from 'react';
import { Box, Checkbox, FormControlLabel, MenuItem, Radio, Stack, TextField, Typography, useTheme } from '@mui/material';
import { authenticationMethods } from '@entities/authentification-method-form-block/model/constants.ts';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { useGetSecretsQuery } from '@shared/api/api/secrets.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectCurrentProject } from '@app/redux/slices/projectSlice/projectSelectors.ts';
import AuthenticationFormPart from '@entities/authentification-method-form-block/ui/AuthenticationFormPart.tsx';
import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';
import { AUTHENTICATION_METHODS } from '@shared/model/constants.ts';

const AuthenticationMethodFormBlock: React.FC = () => {
  const { t } = useTranslation(['clusters', 'shared', 'settings']);
  const theme = useTheme();

  const {
    control,
    watch,
    resetField,
    setValue,
    formState: { errors },
  } = useFormContext();

  const currentProject = useAppSelector(selectCurrentProject);

  const watchAuthenticationMethod = watch(CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD);
  const watchIsSaveToConsole = watch(CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_IS_SAVE_TO_CONSOLE);
  const watchIsUseDefinedSecret = watch(CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET);

  const secrets = useGetSecretsQuery({ type: watchAuthenticationMethod, projectId: currentProject });

  useEffect(() => {
    resetField(CLUSTER_FORM_FIELD_NAMES.SECRET_ID);
  }, [watchIsUseDefinedSecret, watchAuthenticationMethod]);

  useEffect(() => {
    setValue(CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET, !!secrets.data?.data?.length);
  }, [secrets.data?.data?.length]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('authenticationMethod', { ns: 'clusters' })}
      </Typography>
      <Stack direction="column" gap="16px">
        <Stack direction="row" gap="24px">
          <Controller
            control={control}
            name={CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD}
            render={({ field: { value, onChange } }) => (
              <>
                {authenticationMethods(t).map((method: any) => (
                  <Stack
                    key={method.id}
                    sx={{
                      padding: '8px',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      minWidth: 'max-content',
                      width: '100%',
                      backgroundColor: value === method.id
                        ? theme.palette.mode === 'light'
                          ? 'rgba(51, 103, 214, 0.04)'
                          : 'rgba(90, 141, 238, 0.08)'
                        : 'transparent',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: theme.palette.action.hover,
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                    direction="row"
                    onClick={() => onChange(method.id)}>
                    <Radio checked={value === method.id} />
                    <Stack>
                      <Typography fontWeight="bold">{method.name}</Typography>
                      <Typography>{method.description}</Typography>
                    </Stack>
                  </Stack>
                ))}
              </>
            )}
          />
        </Stack>
        {secrets.data?.data?.length ? (
          <>
            <Controller
              control={control}
              name={CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET}
              render={({ field: { value, onChange } }) => (
                <TextField
                  select
                  value={value}
                  onChange={onChange}
                  label={t('useDefinedSecret', { ns: 'clusters' })}
                  fullWidth
                  size="small"
                  error={!!errors[CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET]}
                  helperText={errors[CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET]?.message as string}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {[t('yes', { ns: 'shared' }), t('no', { ns: 'shared' })].map((option) => (
                    // @ts-ignore
                    <MenuItem key={option} value={option === t('yes', { ns: 'shared' })}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {watchIsUseDefinedSecret ? (
              <>
                {watchAuthenticationMethod === AUTHENTICATION_METHODS.SSH ? (
                  <Controller
                    control={control}
                    name={SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value as string}
                        onChange={onChange}
                        label={t('username', { ns: 'shared' })}
                        error={!!errors[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME]}
                        helperText={errors[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME]?.message as string}
                        size="small"
                      />
                    )}
                  />
                ) : null}
                <Controller
                  control={control}
                  name={CLUSTER_FORM_FIELD_NAMES.SECRET_ID}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      select
                      required
                      value={value}
                      onChange={onChange}
                      label={t('secret', { ns: 'settings' })}
                      fullWidth
                      size="small"
                      error={!!errors[CLUSTER_FORM_FIELD_NAMES.SECRET_ID]}
                      helperText={errors[CLUSTER_FORM_FIELD_NAMES.SECRET_ID]?.message as string}>
                      {secrets.data?.data?.map((secret: any) => (
                        <MenuItem key={secret?.id} value={secret?.id}>
                          {secret?.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </>
            ) : (
              <AuthenticationFormPart />
            )}
          </>
        ) : (
          <AuthenticationFormPart />
        )}
        {(secrets.data?.data?.length && !watchIsUseDefinedSecret) || !secrets.data?.data?.length ? (
          <>
            {watchIsSaveToConsole ? (
              <Controller
                control={control}
                name={CLUSTER_FORM_FIELD_NAMES.SECRET_KEY_NAME}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    required
                    value={value as string}
                    onChange={onChange}
                    label={t('secretName', { ns: 'settings' })}
                    error={!!errors[CLUSTER_FORM_FIELD_NAMES.SECRET_KEY_NAME]}
                    helperText={errors[CLUSTER_FORM_FIELD_NAMES.SECRET_KEY_NAME]?.message as string}
                    size="small"
                  />
                )}
              />
            ) : null}
            <Controller
              control={control}
              name={CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_IS_SAVE_TO_CONSOLE}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={<Checkbox />}
                  checked={value as boolean}
                  onChange={onChange}
                  label={t('saveToConsole')}
                />
              )}
            />
          </>
        ) : null}
      </Stack>
    </Box>
  );
};

export default AuthenticationMethodFormBlock;
