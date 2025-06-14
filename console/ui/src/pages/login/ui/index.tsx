import { FC } from 'react';
import { Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import RouterPaths from '@app/router/routerPathsConfig';
import { generateAbsoluteRouterPath } from '@shared/lib/functions.ts';
import { Controller, useForm } from 'react-hook-form';
import { LoginFormValues } from '@pages/login/model/types.ts';
import { LOGIN_FORM_FIELD_NAMES } from '@pages/login/model/constants.ts';
import { version } from '../../../../package.json';
import Logo from '@shared/assets/AutobaseLogo.svg?react';

const Login: FC = () => {
  const { t } = useTranslation('shared');
  const navigate = useNavigate();

  const { handleSubmit, control } = useForm<LoginFormValues>();

  const onSubmit = (values: LoginFormValues) => {
    localStorage.setItem('token', values[LOGIN_FORM_FIELD_NAMES.TOKEN]);
    navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));
  };

  return (
    <Stack width="100%" height="100vh" alignItems="center" justifyContent="center">
      <Paper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
            width="300px"
            height="max-content"
            padding="16px">
            <Logo style={{ width: '50px', height: '50px' }} data-logo="true" />
            <Typography fontWeight="400" variant="h6">Autobase for PostgreSQL®</Typography>
            <Controller
              control={control}
              name={LOGIN_FORM_FIELD_NAMES.TOKEN}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  autoFocus
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label={t('token')}
                  placeholder={t('enterTokenPlaceholder')}
                  size="small"
                />
              )}
            />
            <Button variant="contained" fullWidth type="submit">
              {t('login')}
            </Button>
            <Typography variant="caption" size="small">
              v.{version}
            </Typography>
          </Stack>
        </form>
        <Box position="absolute" bottom="24px" left="24px">
          <Typography variant="caption" size="small">
            Powered by&nbsp;
            <Link href="https://gs-labs.ru/" underline="hover" target="_blank">
              GS Labs
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
};

export default Login;
