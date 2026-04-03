import { FC, Suspense } from 'react';
import { Divider, Stack, Toolbar, useTheme } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Breadcrumbs from '@features/bradcrumbs';
import Spinner from '@shared/ui/spinner';
import { HEADER_HEIGHT } from '@shared/model/constants.ts';

const Main: FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const isSqlEditor = location.pathname.startsWith('/sql-editor');

  return (
    <main style={{ display: 'flex', overflow: 'auto', width: '100%', padding: '8px' }}>
      <Stack width="100%">
        <Toolbar sx={{ minHeight: `${HEADER_HEIGHT} !important`, backgroundColor: theme.palette.background.default }} />
      {!isSqlEditor && (
        <>
          <Breadcrumbs />
          <Divider />
        </>
      )}
      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
    </Stack>
  </main>
)};

export default Main;
