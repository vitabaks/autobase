import { Navigate, Outlet, useLocation } from 'react-router-dom';
import RouterPaths from '@app/router/routerPathsConfig';
import { FC } from 'react';

const PrivateRouteWrapper: FC = () => {
  const location = useLocation();

  // A token is stored only after it was validated against the API at login
  // (see pages/login). Enforcement is server-side: every API call carries the
  // bearer and the backend rejects an invalid one with 401.
  return localStorage.getItem('token') ? (
    <Outlet />
  ) : (
    <Navigate to={RouterPaths.login.absolutePath} replace state={{ path: location.pathname }} />
  );
};

export default PrivateRouteWrapper;
