export const DCS_BLOCK_FIELD_NAMES = Object.freeze({
  TYPE: 'type',
  IS_DEPLOY_NEW_CLUSTER: 'isDeployNewCluster',
  IS_DEPLOY_TO_DB_SERVERS: 'isDeployToDbServers',
  DATABASES: 'dcsDatabases',
  DATABASE_ADDRESS: 'dcsDatabaseAddress',
  DATABASE_PORT: 'dcsDatabasePort',
});

export const DCS_DATABASES_DEFAULT_VALUES = Object.freeze({
  [DCS_BLOCK_FIELD_NAMES.DATABASE_ADDRESS]: 'localhost',
  [DCS_BLOCK_FIELD_NAMES.DATABASE_PORT]: '2379',
});

export const DCS_TYPES = Object.freeze(['etcd', 'consul']);
