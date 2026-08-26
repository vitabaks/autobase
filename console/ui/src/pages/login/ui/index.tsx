import { FC } from 'react';
import { Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import RouterPaths from '@app/router/routerPathsConfig';
import { generateAbsoluteRouterPath } from '@shared/lib/functions.ts';
import { useLazyGetVersionQuery } from '@shared/api/api/other.ts';
import { Controller, useForm } from 'react-hook-form';
import { LoginFormValues } from '@pages/login/model/types.ts';
import { LOGIN_FORM_FIELD_NAMES } from '@pages/login/model/constants.ts';
import { version } from '../../../../package.json';
import Logo from '@shared/assets/AutobaseLogo.svg?react';

const Login: FC = () => {
  const { t } = useTranslation('shared');
  const { t: tToasts } = useTranslation('toasts');
  const navigate = useNavigate();

  const { handleSubmit, control } = useForm<LoginFormValues>();
  const [validateToken, { isFetching }] = useLazyGetVersionQuery();

  const onSubmit = async (values: LoginFormValues) => {
    // Store the entered token first so the request carries it, then validate it
    // against the API (GET /version requires the bearer). The token is never
    // shipped in the built assets, so this is the only place it is checked.
    localStorage.setItem('token', values[LOGIN_FORM_FIELD_NAMES.TOKEN]);
    try {
      await validateToken().unwrap();
      navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));
    } catch {
      localStorage.removeItem('token');
      toast.error(tToasts('invalidToken'));
    }
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
            <Typography fontWeight="400" variant="h6">Autobase Community Edition</Typography>
            <Controller
              control={control}
              name={LOGIN_FORM_FIELD_NAMES.TOKEN}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  autoFocus
                  fullWidth
                  type="password"
                  value={value}
                  onChange={onChange}
                  label={t('token')}
                  placeholder={t('enterTokenPlaceholder')}
                  size="small"
                />
              )}
            />
            <Button variant="contained" fullWidth type="submit" disabled={isFetching}>
              {t('login')}
            </Button>
            <Typography variant="caption" size="small">
              v.{version}
            </Typography>
          </Stack>
        </form>
        <Box position="absolute" bottom="24px" left="24px">
          <Typography variant="caption" size="small">
            Built by&nbsp;
            <Link href="https://gs-labs.ru/" underline="hover" target="_blank">
              GS Labs
            </Link>
            &nbsp;& Autobase Community
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
};

export default Login;
