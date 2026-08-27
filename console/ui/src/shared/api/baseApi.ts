import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@shared/config/constants.ts';
import { clearDbdeskAuthCookie } from '@shared/lib/dbdeskAuthCookie.ts';
import i18n from 'i18next';

const LOGIN_PATH = '/login';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL as string,
  prepareHeaders: (headers, { endpoint }) => {
    headers.set('Accept-Language', i18n.language);
    if (endpoint !== 'login') headers.set('Authorization', `Bearer ${String(localStorage.getItem('token'))}`);
    return headers;
  },
});

const baseQueryWithUnauthorizedHandler: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // The login page handles an invalid candidate token itself so it can show
  // the existing error message without causing an unnecessary page reload.
  if (result.error?.status === 401 && window.location.pathname !== LOGIN_PATH) {
    localStorage.removeItem('token');
    clearDbdeskAuthCookie();
    window.location.replace(LOGIN_PATH);
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithUnauthorizedHandler,
  tagTypes: ['Clusters', 'Operations', 'Secrets', 'Projects', 'Environments', 'Settings'],
  endpoints: () => ({}),
});
