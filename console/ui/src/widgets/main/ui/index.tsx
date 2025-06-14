import { FC, Suspense } from 'react';
import { Divider, Stack, Toolbar, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Breadcrumbs from '@features/bradcrumbs';
import Spinner from '@shared/ui/spinner';

const Main: FC = () => {
  const theme = useTheme();
  return (
    <main style={{ display: 'flex', overflow: 'auto', width: '100%', padding: '8px' }}>
      <Stack width="100%">
        <Toolbar sx={{ backgroundColor: theme.palette.background.default }} />
      <Breadcrumbs />
      <Divider />
      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
    </Stack>
  </main>
)};

export default Main;
