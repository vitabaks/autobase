import { FC } from 'react';
import { AUTHENTICATION_METHODS } from '@shared/model/constants.ts';
import SshMethodFormPart from '@entities/authentification-method-form-block/ui/SshMethodFormPart.tsx';
import PasswordMethodFormPart from '@entities/authentification-method-form-block/ui/PasswordMethodFormPart.tsx';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AuthenticationFormPart: FC = () => {
  const { t } = useTranslation('shared');
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const watchAuthenticationMethod = useWatch({ name: CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD });

  return (
    <>
      <Controller
        control={control}
        name={SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME}
        render={({ field: { value, onChange } }) => (
          <TextField
            fullWidth
            required={watchAuthenticationMethod === AUTHENTICATION_METHODS.PASSWORD}
            value={value as string}
            onChange={onChange}
            label={t('username')}
            error={!!errors[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME]}
            helperText={errors[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME]?.message as string}
            size="small"
          />
        )}
      />
      {watchAuthenticationMethod === AUTHENTICATION_METHODS.SSH ? <SshMethodFormPart /> : <PasswordMethodFormPart />}
    </>
  );
};

export default AuthenticationFormPart;
