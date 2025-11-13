export const DCS_BLOCK_FIELD_NAMES = Object.freeze({
  TYPE: 'type',
  IS_DEPLOY_NEW_CLUSTER: 'isDeployNewCluster',
  IS_DEPLOY_TO_DB_SERVERS: 'isDeployToDbServers',
  DCS_DATABASES: 'dcsDatabases',
  DCS_DATABASE_HOSTNAME: 'dcsDatabaseHostname',
  DCS_DATABASE_IP_ADDRESS: 'dcsDatabaseIpAddress',
  DCS_DATABASE_PORT: 'dcsDatabasePort',
});

export const DCS_DATABASES_DEFAULT_VALUES = Object.freeze({
  [DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_HOSTNAME]: '',
  [DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_IP_ADDRESS]: '',
  [DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_PORT]: '2379',
});

export const DCS_TYPES = Object.freeze(['etcd', 'consul']);

export const getCorrectFields = ({ watchIsDeployToDcsCluster, watchIsDeployToDbServers, watchDcsType, t }) => {
  const fields = [];

  if (!watchIsDeployToDcsCluster) {
    fields.push({
      fieldName: DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_IP_ADDRESS,
      label: t('ipAddress'),
    });
    if (watchDcsType === DCS_TYPES[0]) {
      fields.push({ fieldName: DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_PORT, label: t('port') });
    }
  }
  if (watchIsDeployToDcsCluster && !watchIsDeployToDbServers) {
    fields.push(
      {
        fieldName: DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_HOSTNAME,
        label: t('hostname'),
      },
      {
        fieldName: DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_IP_ADDRESS,
        label: t('ipAddress'),
      },
    );
  }
  return fields;
};
