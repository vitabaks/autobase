import { Action, configureStore, isRejectedWithValue, Middleware, ThunkAction } from '@reduxjs/toolkit';
import { operationsApi } from '@shared/api/api/operations';
import { clustersApi } from '@shared/api/api/clusters.ts';
import { environmentsApi } from '@shared/api/api/environments.ts';
import { projectsApi } from '@shared/api/api/projects.ts';
import { secretsApi } from '@shared/api/api/secrets.ts';
import { settingsApi } from '@shared/api/api/settings.ts';
import { otherApi } from '@shared/api/api/other.ts';
import { projectSlice } from '@app/redux/slices/projectSlice/projectSlice.ts';
import { themeSlice } from '@app/redux/slices/themeSlice/themeSlice.ts';
import { baseApi } from '@shared/api/baseApi.ts';
import { toast } from 'react-toastify';
import { setupListeners } from '@reduxjs/toolkit/query';

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    toast.error(action.payload?.data?.message || action.payload.data?.title);
    console.error(action.payload?.data);
  }
  return next(action);
};

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  [clustersApi.reducerPath]: clustersApi.reducer,
  [environmentsApi.reducerPath]: environmentsApi.reducer,
  [operationsApi.reducerPath]: operationsApi.reducer,
  [projectsApi.reducerPath]: projectsApi.reducer,
  [secretsApi.reducerPath]: secretsApi.reducer,
  [settingsApi.reducerPath]: settingsApi.reducer,
  [otherApi.reducerPath]: otherApi.reducer,
  project: projectSlice.reducer,
  theme: themeSlice.reducer,
};

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(
        baseApi.middleware,
        clustersApi.middleware,
        environmentsApi.middleware,
        operationsApi.middleware,
        projectsApi.middleware,
        secretsApi.middleware,
        settingsApi.middleware,
        otherApi.middleware,
        rtkQueryErrorLogger,
      );
    },
    preloadedState,
  });
  // configure listeners using the provided defaults
  // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
  setupListeners(store.dispatch);
  return store;
};

export const store = makeStore();

// Infer the type of `store`
export type AppStore = typeof store;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;
