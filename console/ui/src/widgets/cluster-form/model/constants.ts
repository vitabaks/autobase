export const numberOfInstances = [1, 3, 7, 15, 32];
export const dataDiskStorage = [10, 100, 500, 1000, 2000, 16000];

const CLUSTER_CLOUD_PROVIDER_FIELD_NAMES = Object.freeze({
  REGION: 'region',
  REGION_CONFIG: 'regionConfig',
  INSTANCE_TYPE: 'instanceType',
  INSTANCE_CONFIG: 'instanceConfig',
  INSTANCES_AMOUNT: 'instancesAmount',
  STORAGE_AMOUNT: 'storageAmount',
  SSH_PUBLIC_KEY: 'sshPublicKey',
});

const CLUSTER_LOCAL_MACHINE_FIELD_NAMES = Object.freeze({
  DATABASE_SERVERS: 'databaseServers',
  EXISTING_CLUSTER: 'existingCluster',
  HOSTNAME: 'hostname',
  IP_ADDRESS: 'ipAddress',
  LOCATION: 'location',
  AUTHENTICATION_METHOD: 'authenticationMethod',
  SECRET_KEY_NAME: 'secretKeyName',
  AUTHENTICATION_IS_SAVE_TO_CONSOLE: 'authenticationSaveToConsole',
  CLUSTER_VIP_ADDRESS: 'clusterVIPAddress',
  IS_HAPROXY_LOAD_BALANCER: 'isHaproxyLoadBalancer',
  IS_USE_DEFINED_SECRET: 'isUseDefinedSecret',
});

export const CLUSTER_FORM_FIELD_NAMES = Object.freeze({
  PROVIDER: 'provider',
  ENVIRONMENT_ID: 'environment',
  CLUSTER_NAME: 'clusterName',
  DESCRIPTION: 'description',
  POSTGRES_VERSION: 'postgresVersion',
  SECRET_ID: 'secretId',
  ...CLUSTER_CLOUD_PROVIDER_FIELD_NAMES,
  ...CLUSTER_LOCAL_MACHINE_FIELD_NAMES,
});
