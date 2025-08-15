import { getEnvVariable } from '@shared/lib/functions.ts';

export const LOCALES = Object.freeze({
  EN_US: 'en',
});

export const API_URL = getEnvVariable('VITE_API_URL');
export const AUTH_TOKEN = getEnvVariable('VITE_AUTH_TOKEN');
export const CLUSTERS_POLLING_INTERVAL = getEnvVariable('VITE_CLUSTERS_POLLING_INTERVAL');
export const CLUSTER_OVERVIEW_POLLING_INTERVAL = getEnvVariable('VITE_CLUSTER_OVERVIEW_POLLING_INTERVAL');
export const OPERATIONS_POLLING_INTERVAL = getEnvVariable('VITE_OPERATIONS_POLLING_INTERVAL');
export const OPERATION_LOGS_POLLING_INTERVAL = getEnvVariable('VITE_OPERATION_LOGS_POLLING_INTERVAL');

export const PAGINATION_LIMIT_OPTIONS = Object.freeze([
  { value: 5, label: 5 },
  { value: 10, label: 10 },
  {
    value: 25,
    label: 25,
  },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
]);

export const PROVIDERS = Object.freeze({
  AWS: 'aws',
  GCP: 'gcp',
  AZURE: 'azure',
  DIGITAL_OCEAN: 'digitalocean',
  HETZNER: 'hetzner',
  LOCAL: 'local',
});
