import { ClusterFormValues } from '@features/cluster-secret-modal/model/types.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { INSTANCES_BLOCK_FIELD_NAMES } from '@entities/cluster/instances-block/model/const.ts';
import { STORAGE_BLOCK_FIELDS } from '@entities/cluster/storage-block/model/const.ts';
import { PROVIDER_CODE_TO_ANSIBLE_USER_MAP } from '@features/cluster-secret-modal/model/constants.ts';
import { SSH_KEY_BLOCK_FIELD_NAMES } from '@entities/cluster/ssh-key-block/model/const.ts';
import { LOAD_BALANCERS_FIELD_NAMES } from '@entities/cluster/load-balancers-block/model/const.ts';
import { AUTHENTICATION_METHODS, IS_EXPERT_MODE } from '@shared/model/constants.ts';
import {
  SECRET_MODAL_CONTENT_BODY_FORM_FIELDS,
  SECRET_MODAL_CONTENT_FORM_FIELD_NAMES,
} from '@entities/secret-form-block/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import { INSTANCES_AMOUNT_BLOCK_VALUES } from '@entities/cluster/instances-amount-block/model/const.ts';
import { NETWORK_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/network-block/model/const.ts';
import { DCS_BLOCK_FIELD_NAMES, DCS_TYPES } from '@entities/cluster/expert-mode/dcs-block/model/const.ts';
import { DATA_DIRECTORY_FIELD_NAMES } from '@entities/cluster/expert-mode/data-directory-block/model/const.ts';
import { DATABASE_SERVERS_FIELD_NAMES } from '@entities/cluster/database-servers-block/model/const.ts';
import { EXTENSION_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/extensions-block/model/const.ts';
import { DATABASES_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/databases-block/model/const.ts';
import { CONNECTION_POOLS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/connection-pools-block/model/const.ts';
import { ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/additional-settings-block/model/const.ts';
import { BACKUP_METHODS, BACKUPS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/backups-block/model/const.ts';
import { POSTGRES_PARAMETERS_FIELD_NAMES } from '@entities/cluster/expert-mode/postgres-parameters-block/model/const.ts';
import { KERNEL_PARAMETERS_FIELD_NAMES } from '@entities/cluster/expert-mode/kernel-parameters-block/model/const.ts';
import { RequestClusterCreate } from '@shared/api/api/clusters.ts';

/**
 * Get value from modal form (postgres or kernel params) and convert to correct format.
 * @param value - Form value.
 */
export const convertModalParametersToArray = (value?: string) =>
  value?.length
    ? value.split(/[\n\r]/).map((item) => {
        const values = item.split(/[:=]/);
        return {
          option: values?.[0].trim(), // due to splitting rule, values might have unnecessary whitespaces that needs to be removed
          value: values?.[1].trim(),
        };
      })
    : value;

/**
 * Functions creates an object with shared cluster envs that should be put in 'extra_vars' request field.
 * @param values - Filled form values.
 */
export const getCommonExtraVars = (values: ClusterFormValues) => ({
  postgresql_version: values[CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION],
  patroni_cluster_name: values[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME],
});

/**
 * Functions creates an object with envs exclusive to cloud clusters that should be put in 'extra_vars' request field.
 * @param values - Filled form values.
 */
export const getCloudProviderExtraVars = (values: ClusterFormValues) => ({
  ...getCommonExtraVars(values),
  cloud_provider: values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code,
  server_type:
    values?.[CLUSTER_FORM_FIELD_NAMES.INSTANCE_TYPE] === 'custom'
      ? values[INSTANCES_BLOCK_FIELD_NAMES.SERVER_TYPE]
      : values[CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG].code,
  server_location: values[CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG].code,
  server_count: values[CLUSTER_FORM_FIELD_NAMES.INSTANCES_AMOUNT],
  volume_size: values[STORAGE_BLOCK_FIELDS.STORAGE_AMOUNT],
  ansible_user: PROVIDER_CODE_TO_ANSIBLE_USER_MAP[values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code],
  ...(values[SSH_KEY_BLOCK_FIELD_NAMES.SSH_PUBLIC_KEY]?.length
    ? { ssh_public_keys: values[SSH_KEY_BLOCK_FIELD_NAMES.SSH_PUBLIC_KEY].split(/[\n\r]/).map((key) => `'${key}'`) }
    : {}),
  ...values[CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG].cloud_image.image,
  ...(IS_EXPERT_MODE
    ? {
        postgresql_data_dir_mount_fstype: values[STORAGE_BLOCK_FIELDS.FILE_SYSTEM_TYPE],
        volume_type: values[STORAGE_BLOCK_FIELDS.VOLUME_TYPE],
        database_public_access: !!values?.[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_DB_PUBLIC_ACCESS],
        cloud_load_balancer: !!values?.[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_CLOUD_LOAD_BALANCER],
        ...([PROVIDERS.AWS, PROVIDERS.GCP, PROVIDERS.AZURE].includes(values[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code) &&
        !!values[INSTANCES_AMOUNT_BLOCK_VALUES.IS_SPOT_INSTANCES]
          ? {
              server_spot: true,
            }
          : {}),
        ...(values[NETWORK_BLOCK_FIELD_NAMES.SERVER_NETWORK]
          ? { server_network: values[NETWORK_BLOCK_FIELD_NAMES.SERVER_NETWORK] }
          : {}),
      }
    : {}),
});

/**
 * Functions creates an object with envs exclusive to local clusters that should be put in 'extra_vars' request field.
 * @param values - Filled form values.
 * @param secretId - Optional ID of secret if exists.
 */
export const getLocalMachineExtraVars = (values: ClusterFormValues, secretId?: number) => ({
  ...getCommonExtraVars(values),
  ...(values[CLUSTER_FORM_FIELD_NAMES.CLUSTER_VIP_ADDRESS]
    ? { cluster_vip: values[CLUSTER_FORM_FIELD_NAMES.CLUSTER_VIP_ADDRESS] }
    : {}),
  ...(values[LOAD_BALANCERS_FIELD_NAMES.IS_HAPROXY_ENABLED] ? { with_haproxy_load_balancing: true } : {}),
  ...(!secretId &&
  !values[CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET] &&
  values[CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD] === AUTHENTICATION_METHODS.PASSWORD
    ? {
        ansible_user: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME],
        ansible_ssh_pass: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.PASSWORD],
      }
    : {}),
  ...(IS_EXPERT_MODE
    ? {
        dcs_type: values?.[DCS_BLOCK_FIELD_NAMES.TYPE],
        ...(!values[DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_NEW_CLUSTER]
          ? {
              dcs_exists: true,
              ...(values[DCS_BLOCK_FIELD_NAMES.TYPE] === DCS_TYPES.ETCD
                ? {
                    patroni_etcd_hosts: values?.[DCS_BLOCK_FIELD_NAMES.DCS_DATABASES]?.map((database) => ({
                      host: database[DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_IP_ADDRESS],
                      port: database[DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_PORT],
                    })),
                  }
                : {
                    consul_join: values?.[DCS_BLOCK_FIELD_NAMES.DCS_DATABASES]?.map(
                      (database) => database[DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_IP_ADDRESS],
                    ),
                    consul_ports_serf_lan: 8301,
                  }),
            }
          : {}),
        postgresql_data_dir: values?.[DATA_DIRECTORY_FIELD_NAMES.DATA_DIRECTORY],
      }
    : {}),
});

/**
 * Function maps a field array into correct request format for DCS config.
 * @param values - Filled form values.
 * @param role - Optional role for Consul instances.
 * @param shouldAddHostname - An optional flag determines if field 'hostname' should be added. True by default.
 * @param isDbServers - An optional flag determines which db servers are mapping - Database servers or DCS. True by default.
 */
const configureHosts = ({
  values,
  role,
  shouldAddHostname = false,
  isDbServers = true,
}: {
  values: ClusterFormValues;
  role?: string;
  shouldAddHostname?: boolean;
  isDbServers?: boolean;
}) => {
  const dbServersKeys = {
    servers: DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS,
    ipAddress: DATABASE_SERVERS_FIELD_NAMES.DATABASE_IP_ADDRESS,
  };

  const dcsHostsKeys = {
    servers: DCS_BLOCK_FIELD_NAMES.DCS_DATABASES,
    ipAddress: DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_IP_ADDRESS,
    hostname: DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_HOSTNAME,
  };

  const usedKeys = isDbServers ? dbServersKeys : dcsHostsKeys;

  return values[usedKeys.servers].reduce(
    (acc, server) => ({
      ...acc,
      [server[usedKeys.ipAddress]]: {
        ansible_host: server[usedKeys.ipAddress],
        ...(shouldAddHostname && usedKeys?.hostname ? { hostname: server[usedKeys.hostname] } : {}),
        ...(role ? { consul_node_role: role } : {}),
      },
    }),
    {},
  );
};

/**
 * Function maps DCS fields into the correct request format.
 * @param values - Filled form values.
 */
const constructDcsEnvs = (values: ClusterFormValues) => {
  if (values[DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_NEW_CLUSTER]) {
    if (!IS_EXPERT_MODE) {
      return {
        etcd_cluster: {
          hosts: configureHosts({ values }),
        },
        consul_instances: { hosts: {} },
      };
    }
    if (IS_EXPERT_MODE) {
      switch (values[DCS_BLOCK_FIELD_NAMES.TYPE]) {
        case DCS_TYPES.ETCD:
          return {
            etcd_cluster: {
              hosts: configureHosts({
                values,
                isDbServers: values[DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_TO_DB_SERVERS],
                shouldAddHostname: !values[DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_TO_DB_SERVERS],
              }),
            },
            consul_instances: { hosts: {} },
          };
        case DCS_TYPES.CONSUL:
          return {
            etcd_cluster: {
              hosts: {},
            },
            consul_instances: {
              hosts: values[DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_TO_DB_SERVERS]
                ? configureHosts({ values, role: 'server' })
                : {
                    ...configureHosts({ values, role: 'client' }),
                    ...configureHosts({ values, role: 'server', isDbServers: false, shouldAddHostname: true }),
                  },
            },
          };
        default:
          return {
            etcd_cluster: { hosts: {} },
            consul_instances: {
              hosts: {},
            },
          };
      }
    }
  }
  if (IS_EXPERT_MODE && !values[DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_NEW_CLUSTER]) {
    if (values[DCS_BLOCK_FIELD_NAMES.TYPE] === DCS_TYPES.CONSUL) {
      return {
        consul_instances: {
          hosts: configureHosts({ values, role: 'client' }),
        },
      };
    }
  }
};

/**
 * Function maps Load Balancers block form values into correct request format.
 * @param values - Filled form values.
 */
const constructBalancersEnvs = (values: ClusterFormValues) => {
  let balancerHosts = {};

  if (values[LOAD_BALANCERS_FIELD_NAMES.IS_HAPROXY_ENABLED]) {
    if (IS_EXPERT_MODE && !values[LOAD_BALANCERS_FIELD_NAMES.IS_DEPLOY_TO_DATABASE_SERVERS]) {
      balancerHosts = values[LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES].reduce(
        (acc, server) => ({
          ...acc,
          [server[LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES_IP_ADDRESS]]: {
            ansible_host: server[LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES_IP_ADDRESS],
          },
        }),
        {},
      );
    } else {
      balancerHosts = values[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS].reduce(
        (acc, server) => ({
          ...acc,
          [server[DATABASE_SERVERS_FIELD_NAMES.DATABASE_IP_ADDRESS]]: {
            ansible_host: server[DATABASE_SERVERS_FIELD_NAMES.DATABASE_IP_ADDRESS],
          },
        }),
        {},
      );
    }
  }

  return {
    balancers: {
      hosts: balancerHosts,
    },
  };
};

/**
 * Functions creates an object with envs exclusive to local clusters.
 * @param values - Filled form values.
 * @param secretId - Optional ID of secret if exists.
 */
export const getLocalMachineEnvs = (values: ClusterFormValues, secretId?: number) => ({
  ...(values[CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD] === AUTHENTICATION_METHODS.SSH &&
  !values[CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET] &&
  !secretId
    ? {
        SSH_PRIVATE_KEY_CONTENT: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SSH_PRIVATE_KEY],
      }
    : {}),
  ANSIBLE_INVENTORY_JSON: {
    all: {
      vars: {
        ansible_user: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME],
        ...(values[CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD] === AUTHENTICATION_METHODS.PASSWORD
          ? {
              ansible_ssh_pass: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME],
              ansible_sudo_pass: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.PASSWORD],
            }
          : {}),
      },
      children: {
        ...constructBalancersEnvs(values),
        ...constructDcsEnvs(values),
        master: {
          hosts: {
            [values[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS][0][
              DATABASE_SERVERS_FIELD_NAMES.DATABASE_IP_ADDRESS
            ]]: {
              hostname:
                values[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS][0][
                  DATABASE_SERVERS_FIELD_NAMES.DATABASE_HOSTNAME
                ],
              ansible_host:
                values[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS][0][
                  DATABASE_SERVERS_FIELD_NAMES.DATABASE_IP_ADDRESS
                ],
              server_location:
                values[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS]?.[0]?.[
                  DATABASE_SERVERS_FIELD_NAMES.DATABASE_LOCATION
                ],
              postgresql_exists: IS_EXPERT_MODE
                ? values[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS]?.[0]?.[
                    DATABASE_SERVERS_FIELD_NAMES.IS_POSTGRESQL_EXISTS
                  ]
                : (values[DATABASE_SERVERS_FIELD_NAMES.IS_CLUSTER_EXISTS] ?? false),
            },
          },
        },
        ...(values[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS].length > 1
          ? {
              replica: {
                hosts: values[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS].slice(1).reduce(
                  (acc, server) => ({
                    ...acc,
                    [server[DATABASE_SERVERS_FIELD_NAMES.DATABASE_IP_ADDRESS]]: {
                      hostname: server?.[DATABASE_SERVERS_FIELD_NAMES.DATABASE_HOSTNAME],
                      ansible_host: server?.[DATABASE_SERVERS_FIELD_NAMES.DATABASE_IP_ADDRESS],
                      server_location: server?.[DATABASE_SERVERS_FIELD_NAMES.DATABASE_LOCATION],
                      postgresql_exists: IS_EXPERT_MODE
                        ? server?.[DATABASE_SERVERS_FIELD_NAMES.IS_POSTGRESQL_EXISTS]
                        : (values[DATABASE_SERVERS_FIELD_NAMES.IS_CLUSTER_EXISTS] ?? false),
                    },
                  }),
                  {},
                ),
              },
            }
          : {}),
        postgres_cluster: {
          children: {
            master: {},
            replica: {},
          },
        },
      },
    },
  },
});

/**
 * Function converts 'extensions' form value into request format.
 * @param values - Filled form values.
 */
const getExtensions = (values: ClusterFormValues) =>
  Object.entries(values?.[EXTENSION_BLOCK_FIELD_NAMES.EXTENSIONS])?.reduce(
    (acc, [key, value]) => {
      if (value?.db?.length) {
        const convertedToReqFormat = value.db.map((item) => ({
          // convert extension values into [{ext:"", db:""}] format, accepted for API call
          ext: key,
          db: values[DATABASES_BLOCK_FIELD_NAMES.NAMES][item],
        }));
        const convertedToExtraVars = value?.isThirdParty // transform third party extensions in {enable_name: true} format. This object should be passed as extra_vars to enable them
          ? {
              ...acc.extraVars,
              [`enable_${key}`]: true,
            }
          : acc.extraVars;
        return { db: [...acc.db, ...convertedToReqFormat], extraVars: convertedToExtraVars };
      }
      return acc;
    },
    { db: [], extraVars: {} },
  ) ?? { db: [], extraVars: {} };

/**
 * Functions creates an object with base cluster extra_vars shared between cloud and local clusters.
 * @param values - Filled form values.
 */
export const getBaseClusterExtraVars = (values: ClusterFormValues) => {
  const extensions = IS_EXPERT_MODE ? getExtensions(values) : [];

  return IS_EXPERT_MODE
    ? {
        postgresql_databases: values[DATABASES_BLOCK_FIELD_NAMES.DATABASES]?.map((db) => ({
          db: db?.[DATABASES_BLOCK_FIELD_NAMES.DATABASE_NAME],
          owner: db?.[DATABASES_BLOCK_FIELD_NAMES.USER_NAME],
          encoding: db?.[DATABASES_BLOCK_FIELD_NAMES.ENCODING],
          lc_ctype: db?.[DATABASES_BLOCK_FIELD_NAMES.LOCALE],
          lc_collate: db?.[DATABASES_BLOCK_FIELD_NAMES.LOCALE],
        })),
        postgresql_users: values[DATABASES_BLOCK_FIELD_NAMES.DATABASES]?.map((db) => ({
          name: db?.[DATABASES_BLOCK_FIELD_NAMES.USER_NAME],
          password: db?.[DATABASES_BLOCK_FIELD_NAMES.USER_PASSWORD],
        })),
        pgbouncer_install: !!values[CONNECTION_POOLS_BLOCK_FIELD_NAMES.IS_CONNECTION_POOLER_ENABLED],
        netdata_install: !!values?.[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_NETDATA_MONITORING],
        ...(values[CONNECTION_POOLS_BLOCK_FIELD_NAMES.IS_CONNECTION_POOLER_ENABLED] // do not add pools info if connection pooler is disabled
          ? {
              pgbouncer_pools: values?.[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS]?.map((pool) => ({
                name: pool?.[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_NAME],
                dbname: pool?.[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_NAME],
                pool_parameters: {
                  pool_size: pool?.[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_SIZE],
                  pool_mode: pool?.[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_MODE],
                },
              })),
            }
          : {}),
        ...(extensions?.db?.length ? { postgresql_extensions: extensions?.db } : {}),
        ...extensions?.extraVars,
        ...(values?.[BACKUPS_BLOCK_FIELD_NAMES.IS_BACKUPS_ENABLED] && values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_METHOD]
          ? values[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_METHOD] === BACKUP_METHODS.PG_BACK_REST
            ? {
                pgbackrest_install: true,
                pgbackrest_backup_hour: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_START_TIME],
                pgbackrest_retention_full: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION],
                pgbackrest_retention_archive: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION],
                ...(values?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG]
                  ? {
                      pgbackrest_auto_conf: false,
                      pgbackrest_conf: {
                        global: convertModalParametersToArray(values?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG]),
                      },
                    }
                  : {}),
                ...([PROVIDERS.DIGITAL_OCEAN, PROVIDERS.HETZNER].includes(
                  values?.[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code,
                )
                  ? {
                      pgbackrest_s3_key: values?.[BACKUPS_BLOCK_FIELD_NAMES.ACCESS_KEY],
                      pgbackrest_s3_key_secret: values?.[BACKUPS_BLOCK_FIELD_NAMES.SECRET_KEY],
                    }
                  : {}),
              }
            : {
                wal_g_install: true,
                wal_g_backup_hour: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_START_TIME],
                wal_g_retention_full: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION],
                ...(values?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG]
                  ? {
                      wal_g_auto_conf: false,
                      wal_g_json: convertModalParametersToArray(values?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG]),
                    }
                  : {}),
                ...([PROVIDERS.DIGITAL_OCEAN, PROVIDERS.HETZNER].includes(
                  values?.[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code,
                )
                  ? {
                      wal_g_aws_access_key_id: values?.[BACKUPS_BLOCK_FIELD_NAMES.ACCESS_KEY],
                      wal_g_aws_secret_access_key: values?.[BACKUPS_BLOCK_FIELD_NAMES.SECRET_KEY],
                    }
                  : {}),
              }
          : {}),
        ...(values?.[POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS]
          ? {
              local_postgresql_parameters: convertModalParametersToArray(
                values?.[POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS],
              ),
            }
          : {}),
        ...(values?.[KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS]
          ? {
              sysctl_set: true,
              sysctl_conf: {
                postgres_cluster: convertModalParametersToArray(
                  values?.[KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS],
                ),
              },
            }
          : {}),
        ...(values?.[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.SYNC_STANDBY_NODES]
          ? {
              synchronous_mode: true,
              synchronous_node_count: values[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.SYNC_STANDBY_NODES],
              ...(values?.[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_SYNC_MODE_STRICT]
                ? { synchronous_mode_strict: true }
                : {}),
            }
          : {}),
      }
    : {};
};

const convertObjectValueToBase64Format = (object: Record<string, any>) =>
  Object.entries(object).reduce((acc: string[], [key, value]) => [...acc, `${key}=${btoa(JSON.stringify(value))}`], []);

const getRequestCloudParams = (values, secretsInfo, customExtraVars) => ({
  envs: convertObjectValueToBase64Format({
    ...Object.fromEntries(
      Object.entries({
        ...secretsInfo,
      }).filter(([key]) => SECRET_MODAL_CONTENT_BODY_FORM_FIELDS?.[key]),
    ),
  }),
  extra_vars: customExtraVars ?? {
    ...getBaseClusterExtraVars(values),
    ...getCloudProviderExtraVars(values),
  },
});

const getRequestLocalMachineParams = (values, secretId, customExtraVars) => ({
  envs: convertObjectValueToBase64Format(getLocalMachineEnvs(values, secretId)),
  extra_vars: customExtraVars ?? {
    ...getBaseClusterExtraVars(values),
    ...getLocalMachineExtraVars(values, secretId),
  },
  existing_cluster: values[DATABASE_SERVERS_FIELD_NAMES.IS_CLUSTER_EXISTS] ?? false,
});

/**
 * Functions creates an object with fields and values in format required by API.
 * @param values - Filled form values.
 * @param secretId - Optional ID of secret if exists.
 * @param projectId - Optional ID of a current project.
 * @param secretsInfo - Optional object with secret information.
 * @param customExtraVars - Optional parameter with custom extra vars (from YAML editor).
 */
export const mapFormValuesToRequestFields = ({
  values,
  secretId,
  projectId,
  secretsInfo,
  customExtraVars,
}: {
  values: ClusterFormValues;
  secretId?: number;
  projectId: number;
  secretsInfo?: object;
  customExtraVars?: Record<string, never>;
}): RequestClusterCreate => {
  const baseObject = {
    name: values[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME],
    environment_id: values[CLUSTER_FORM_FIELD_NAMES.ENVIRONMENT_ID],
    description: values[CLUSTER_FORM_FIELD_NAMES.DESCRIPTION],
    ...(secretId ? { auth_info: { secret_id: secretId } } : {}),
    project_id: projectId,
  };

  return {
    ...baseObject,
    ...(values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code !== PROVIDERS.LOCAL
      ? getRequestCloudParams(values, secretsInfo, customExtraVars)
      : getRequestLocalMachineParams(values, secretId, customExtraVars)),
  };
};
