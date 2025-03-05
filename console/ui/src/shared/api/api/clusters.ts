import { baseApi as api } from '../baseApi.ts';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    postClusters: build.mutation<PostClustersApiResponse, PostClustersApiArg>({
      query: (queryArg) => ({ url: `/clusters`, method: 'POST', body: queryArg.requestClusterCreate }),
      invalidatesTags: () => [{ type: 'Clusters', id: 'LIST' }],
    }),
    getClusters: build.query<GetClustersApiResponse, GetClustersApiArg>({
      query: (queryArg) => ({
        url: `/clusters`,
        params: {
          offset: queryArg.offset,
          limit: queryArg.limit,
          project_id: queryArg.projectId,
          name: queryArg.name,
          status: queryArg.status,
          location: queryArg.location,
          environment: queryArg.environment,
          server_count: queryArg.serverCount,
          postgres_version: queryArg.postgresVersion,
          created_at_from: queryArg.createdAtFrom,
          created_at_to: queryArg.createdAtTo,
          sort_by: queryArg.sortBy,
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: 'Clusters', id })), { type: 'Clusters', id: 'LIST' }]
          : [{ type: 'Clusters', id: 'LIST' }],
    }),
    getClustersDefaultName: build.query<GetClustersDefaultNameApiResponse, GetClustersDefaultNameApiArg>({
      query: () => ({ url: `/clusters/default_name` }),
      keepUnusedDataFor: 0,
    }),
    getClustersById: build.query<GetClustersByIdApiResponse, GetClustersByIdApiArg>({
      query: (queryArg) => ({ url: `/clusters/${queryArg.id}` }),
      providesTags: (result, error, { id }) => [{ type: 'Clusters', id }],
    }),
    deleteClustersById: build.mutation<DeleteClustersByIdApiResponse, DeleteClustersByIdApiArg>({
      query: (queryArg) => ({ url: `/clusters/${queryArg.id}`, method: 'DELETE' }),
      invalidatesTags: () => [{ type: 'Clusters', id: 'LIST' }],
    }),
    postClustersByIdRefresh: build.mutation<PostClustersByIdRefreshApiResponse, PostClustersByIdRefreshApiArg>({
      query: (queryArg) => ({ url: `/clusters/${queryArg.id}/refresh`, method: 'POST' }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Clusters', id }],
    }),
    postClustersByIdReinit: build.mutation<PostClustersByIdReinitApiResponse, PostClustersByIdReinitApiArg>({
      query: (queryArg) => ({
        url: `/clusters/${queryArg.id}/reinit`,
        method: 'POST',
        body: queryArg.requestClusterReinit,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Clusters', id }],
    }),
    postClustersByIdReload: build.mutation<PostClustersByIdReloadApiResponse, PostClustersByIdReloadApiArg>({
      query: (queryArg) => ({
        url: `/clusters/${queryArg.id}/reload`,
        method: 'POST',
        body: queryArg.requestClusterReload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Clusters', id }],
    }),
    postClustersByIdRestart: build.mutation<PostClustersByIdRestartApiResponse, PostClustersByIdRestartApiArg>({
      query: (queryArg) => ({
        url: `/clusters/${queryArg.id}/restart`,
        method: 'POST',
        body: queryArg.requestClusterRestart,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Clusters', id }],
    }),
    postClustersByIdStop: build.mutation<PostClustersByIdStopApiResponse, PostClustersByIdStopApiArg>({
      query: (queryArg) => ({
        url: `/clusters/${queryArg.id}/stop`,
        method: 'POST',
        body: queryArg.requestClusterStop,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Clusters', id }],
    }),
    postClustersByIdStart: build.mutation<PostClustersByIdStartApiResponse, PostClustersByIdStartApiArg>({
      query: (queryArg) => ({
        url: `/clusters/${queryArg.id}/start`,
        method: 'POST',
        body: queryArg.requestClusterStart,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Clusters', id }],
    }),
    postClustersByIdRemove: build.mutation<PostClustersByIdRemoveApiResponse, PostClustersByIdRemoveApiArg>({
      query: (queryArg) => ({
        url: `/clusters/${queryArg.id}/remove`,
        method: 'POST',
        body: queryArg.requestClusterRemove,
      }),
      invalidatesTags: () => [{ type: 'Clusters', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as clustersApi };
export type PostClustersApiResponse = /** status 200 OK */ ResponseClusterCreate;
export type PostClustersApiArg = {
  requestClusterCreate: RequestClusterCreate;
};
export type GetClustersApiResponse = /** status 200 OK */ ResponseClustersInfo;
export type GetClustersApiArg = {
  offset?: number;
  limit?: number;
  projectId: number;
  /** Filter by name */
  name?: string;
  /** Filter by status */
  status?: string;
  /** Filter by location */
  location?: string;
  /** Filter by environment */
  environment?: string;
  /** Filter by server_count */
  serverCount?: number;
  /** Filter by postgres_version */
  postgresVersion?: number;
  /** Created at after this date */
  createdAtFrom?: string;
  /** Created at till this date */
  createdAtTo?: string;
  /** Sort by fields. Example: sort_by=id,-name,created_at,updated_at
   Supported values:
   - id
   - name
   - created_at
   - updated_at
   - environment
   - project
   - status
   - location
   - server_count
   - postgres_version
   */
  sortBy?: string;
};
export type GetClustersDefaultNameApiResponse = /** status 200 OK */ ResponseClusterDefaultName;
export type GetClustersDefaultNameApiArg = void;
export type GetClustersByIdApiResponse = /** status 200 OK */ ClusterInfo;
export type GetClustersByIdApiArg = {
  id: number;
};
export type DeleteClustersByIdApiResponse = /** status 204 OK */ void;
export type DeleteClustersByIdApiArg = {
  id: number;
};
export type PostClustersByIdRefreshApiResponse = /** status 200 OK */ ClusterInfo;
export type PostClustersByIdRefreshApiArg = {
  id: number;
};
export type PostClustersByIdReinitApiResponse = /** status 200 OK */ ResponseClusterCreate;
export type PostClustersByIdReinitApiArg = {
  id: number;
  requestClusterReinit: RequestClusterReinit;
};
export type PostClustersByIdReloadApiResponse = /** status 200 OK */ ResponseClusterCreate;
export type PostClustersByIdReloadApiArg = {
  id: number;
  requestClusterReload: RequestClusterReload;
};
export type PostClustersByIdRestartApiResponse = /** status 200 OK */ ResponseClusterCreate;
export type PostClustersByIdRestartApiArg = {
  id: number;
  requestClusterRestart: RequestClusterRestart;
};
export type PostClustersByIdStopApiResponse = /** status 200 OK */ ResponseClusterCreate;
export type PostClustersByIdStopApiArg = {
  id: number;
  requestClusterStop: RequestClusterStop;
};
export type PostClustersByIdStartApiResponse = /** status 200 OK */ ResponseClusterCreate;
export type PostClustersByIdStartApiArg = {
  id: number;
  requestClusterStart: RequestClusterStart;
};
export type PostClustersByIdRemoveApiResponse = /** status 204 OK */ void;
export type PostClustersByIdRemoveApiArg = {
  id: number;
  requestClusterRemove: RequestClusterRemove;
};
export type ResponseClusterCreate = {
  /** unique code for cluster */
  cluster_id?: number;
};
export type ErrorObject = {
  code?: number;
  title?: string;
  description?: string;
};
export type RequestClusterCreate = {
  name?: string;
  /** Info about cluster */
  description?: string;
  /** Info for deployment system authorization */
  auth_info?: {
    secret_id?: number;
  };
  /** Project for new cluster */
  project_id?: number;
  /** Project environment */
  environment_id?: number;
  envs?: string[];
  extra_vars?: string[];
};
export type ClusterInfoInstance = {
  id?: number;
  name?: string;
  ip?: string;
  status?: string;
  role?: string;
  timeline?: number | null;
  lag?: number | null;
  tags?: object;
  pending_restart?: boolean | null;
};
export type ClusterInfo = {
  id?: number;
  name?: string;
  description?: string;
  status?: string;
  creation_time?: string;
  environment?: string;
  servers?: ClusterInfoInstance[];
  postgres_version?: number;
  /** Code of location */
  cluster_location?: string;
  /** Project for cluster */
  project_name?: string;
  connection_info?: object;
};
export type PaginationInfoForListRequests = {
  offset?: number | null;
  limit?: number | null;
  count?: number | null;
};
export type ResponseClustersInfo = {
  data?: ClusterInfo[];
  meta?: PaginationInfoForListRequests;
};
export type ResponseClusterDefaultName = {
  name?: string;
};
export type RequestClusterReinit = object;
export type RequestClusterReload = object;
export type RequestClusterRestart = object;
export type RequestClusterStop = object;
export type RequestClusterStart = object;
export type RequestClusterRemove = object;
export const {
  usePostClustersMutation,
  useGetClustersQuery,
  useLazyGetClustersQuery,
  useGetClustersDefaultNameQuery,
  useLazyGetClustersDefaultNameQuery,
  useGetClustersByIdQuery,
  useLazyGetClustersByIdQuery,
  useDeleteClustersByIdMutation,
  usePostClustersByIdRefreshMutation,
  usePostClustersByIdReinitMutation,
  usePostClustersByIdReloadMutation,
  usePostClustersByIdRestartMutation,
  usePostClustersByIdStopMutation,
  usePostClustersByIdStartMutation,
  usePostClustersByIdRemoveMutation,
} = injectedRtkApi;
