import { lazy } from 'react';
import { Route } from 'react-router-dom';
import RouterPaths from '@app/router/routerPathsConfig';

const SqlEditor = lazy(() => import('@pages/sql-editor'));

const SqlEditorRoutes = () => (
  <Route
    path={RouterPaths.sqlEditor.absolutePath}
    handle={{
      breadcrumb: { label: 'SQL Editor', ns: 'shared' },
    }}
    element={<SqlEditor />}
  />
);

export default SqlEditorRoutes;
