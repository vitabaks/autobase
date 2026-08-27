import { Navigate, Outlet, useLocation } from 'react-router-dom';
import RouterPaths from '@app/router/routerPathsConfig';
import { FC, useEffect } from 'react';
import { setDbdeskAuthCookie } from '@shared/lib/dbdeskAuthCookie.ts';

const PrivateRouteWrapper: FC = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Keep the SQL editor auth cookie in sync for validated sessions restored
    // from localStorage without exposing the expected token in the UI bundle.
    if (token) setDbdeskAuthCookie(token);
  }, [token]);

  // A token is stored only after it was validated against the API at login
  // (see pages/login). Enforcement is server-side: every API call carries the
  // bearer and the backend rejects an invalid one with 401.
  return token ? (
    <Outlet />
  ) : (
    <Navigate to={RouterPaths.login.absolutePath} replace state={{ path: location.pathname }} />
  );
};

export default PrivateRouteWrapper;
