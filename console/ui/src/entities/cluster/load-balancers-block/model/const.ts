export const LOAD_BALANCERS_FIELD_NAMES = Object.freeze({
  IS_HAPROXY_ENABLED: 'isHaproxyEnabled',
  IS_DEPLOY_TO_DATABASE_SERVERS: 'isDeployToDatabaseServers',
  DATABASES: 'loadBalancerDatabases',
  DATABASES_HOSTNAME: 'loadBalancerDatabasesHostname',
  DATABASES_ADDRESS: 'loadBalancerDatabasesAddress',
});

export const LOAD_BALANCERS_DATABASES_DEFAULT_VALUES = Object.freeze({
  [LOAD_BALANCERS_FIELD_NAMES.DATABASES_HOSTNAME]: '',
  [LOAD_BALANCERS_FIELD_NAMES.DATABASES_ADDRESS]: '',
});
