import { FC } from 'react';
import Illustration from '@pages/404/ui/illustration.tsx';
import { useTranslation } from 'react-i18next';
import RouterPaths from '@app/router/routerPathsConfig';
import { generateAbsoluteRouterPath } from '@shared/lib/functions.ts';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';

const Page404: FC = () => {
  const { t } = useTranslation('shared');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleReturnButton = () => navigate(generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath));

  return (
    <Container sx={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '100px' }}>
      <Box position="relative" padding="100px">
        <Illustration style={{ position: 'absolute', inset: 0, color: theme.palette.primary.lighter10 }} />
        <Box position="relative" display="flex" flexDirection="column" alignItems="center" gap="16px" zIndex={1}>
          <Typography variant={'h4'} fontWeight="bold">
            {t('404Title')}
          </Typography>
          <Typography color="text.secondary" whiteSpace="pre-line">
            {t('404Text')}
          </Typography>
          <Box>
            <Button variant="contained" onClick={handleReturnButton}>
              {t('404ButtonText')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Page404;
