import { baseApi as api } from '../baseApi.ts';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getExternalDeployments: build.query<GetExternalDeploymentsApiResponse, GetExternalDeploymentsApiArg>({
      query: (queryArg) => ({
        url: `/external/deployments`,
        params: { offset: queryArg.offset, limit: queryArg.limit },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as deploymentsApi };
export type GetExternalDeploymentsApiResponse = /** status 200 OK */ DeploymentsInfo;
export type GetExternalDeploymentsApiArg = {
  offset?: number;
  limit?: number;
};
export type DeploymentCloudImage = {
  image?: object;
  arch?: string;
  os_name?: string;
  os_version?: string;
  updated_at?: string;
};
export type DeploymentInfoCloudRegion = {
  /** unique parameter for DB */
  code?: string;
  /** Field for web */
  name?: string;
  /** List of datacenters for this region */
  datacenters?: {
    code?: string;
    location?: string;
    cloud_image?: DeploymentCloudImage;
  }[];
};
export type DeploymentInstanceType = {
  code?: string;
  cpu?: number;
  ram?: number;
  shared_cpu?: boolean;
  /** Price for 1 instance by hour */
  price_hourly?: number;
  /** Price for 1 instance by month */
  price_monthly?: number;
  /** Price currency */
  currency?: string;
};
export type ResponseDeploymentInfo = {
  code?: string;
  description?: string;
  avatar_url?: string;
  /** List of available regions for current deployment */
  cloud_regions?: DeploymentInfoCloudRegion[];
  /** Lists of available instance types */
  instance_types?: {
    small?: DeploymentInstanceType[] | null;
    medium?: DeploymentInstanceType[];
    large?: DeploymentInstanceType[];
  };
  /** Hardware disks info */
  volumes?: {
    /** Volume type */
    volume_type?: string;
    /** Volume description */
    volume_description?: string;
    /** Sets in GB */
    min_size?: number;
    /** Sets in GB */
    max_size?: number;
    /** Price for disk by months */
    price_monthly?: number;
    /** Price currency */
    currency?: string;
    /** Default volume */
    is_default?: boolean | null;
  }[];
};
export type PaginationInfoForListRequests = {
  offset?: number | null;
  limit?: number | null;
  count?: number | null;
};
export type DeploymentsInfo = {
  data?: ResponseDeploymentInfo[];
  meta?: PaginationInfoForListRequests;
};
export type ErrorObject = {
  code?: number;
  title?: string;
  description?: string;
};
export const { useGetExternalDeploymentsQuery, useLazyGetExternalDeploymentsQuery } = injectedRtkApi;
