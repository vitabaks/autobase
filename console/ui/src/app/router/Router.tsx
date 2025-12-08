import { FC, lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Layout from '../layout';
import ClustersRoutes from '@app/router/routerConfig/ClustersRoutes.tsx';
import OperationsRoutes from '@app/router/routerConfig/OperationsRoutes.tsx';
import SettingsRoutes from '@app/router/routerConfig/SettingsRoutes.tsx';
import RouterPaths from '@app/router/routerPathsConfig';
import PrivateRouteWrapper from '@app/router/PrivateRouterWrapper.tsx';
import Spinner from '@shared/ui/spinner';

const Login = lazy(() => import('@pages/login'));
const Page404 = lazy(() => import('@pages/404'));

const Router: FC = () => {
  const routes = createRoutesFromElements(
    <Route
      path="/"
      element={
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      }>
      <Route path={RouterPaths.login.absolutePath} element={<Login />} />
      <Route path={RouterPaths.notFound.absolutePath} element={<Page404 />} />
      <Route element={<PrivateRouteWrapper />}>
        <Route element={<Layout />}>
          {ClustersRoutes()}
          {OperationsRoutes()}
          {SettingsRoutes()}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={`/${RouterPaths.notFound.absolutePath}`} replace />} />
    </Route>,
  );

  const browserRouter = createBrowserRouter(routes);

  return <RouterProvider router={browserRouter} />;
};

export default Router;
