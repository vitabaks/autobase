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
        pg_data_mount_fstype: values[STORAGE_BLOCK_FIELDS.FILE_SYSTEM_TYPE],
        volume_type: values[STORAGE_BLOCK_FIELDS.VOLUME_TYPE],
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
  ...getCommonExtraVars(values),
});

/**
 * Functions creates an object with envs exclusive to local clusters that should be put in 'extra_vars' request field.
 * @param values - Filled form values.
 * @param secretId - Optional ID of secret if exists.
 */
export const getLocalMachineExtraVars = (values: ClusterFormValues, secretId?: number) => ({
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
        ...(!values[DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_NEW_CLUSTER] && values[DCS_BLOCK_FIELD_NAMES.TYPE] === DCS_TYPES[0]
          ? {
              patroni_etcd_hosts: values?.[DCS_BLOCK_FIELD_NAMES.DATABASES]?.map((database) => ({
                host: database[DCS_BLOCK_FIELD_NAMES.IP_ADDRESS],
                port: database[DCS_BLOCK_FIELD_NAMES.DATABASE_PORT],
              })),
            }
          : !values[DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_NEW_CLUSTER] && values[DCS_BLOCK_FIELD_NAMES.TYPE] === DCS_TYPES[1]
            ? {
                consul_join: values?.[DCS_BLOCK_FIELD_NAMES.DATABASES]?.map(
                  (database) => database[DCS_BLOCK_FIELD_NAMES.IP_ADDRESS],
                ),
                consul_ports_serf_lan: 8301,
              }
            : {}),
        ...(!values[LOAD_BALANCERS_FIELD_NAMES.IS_DEPLOY_TO_DATABASE_SERVERS] &&
        values[LOAD_BALANCERS_FIELD_NAMES.IS_HAPROXY_ENABLED]
          ? {
              balancers: values[LOAD_BALANCERS_FIELD_NAMES.DATABASES].reduce(
                (acc, server) => ({
                  ...acc,
                  [server[LOAD_BALANCERS_FIELD_NAMES.DATABASES_ADDRESS]]: {
                    ansible_host: server[LOAD_BALANCERS_FIELD_NAMES.DATABASES_ADDRESS],
                  },
                }),
                {},
              ),
            }
          : {}),
        postgresql_data_dir: values?.[DATA_DIRECTORY_FIELD_NAMES.DATA_DIRECTORY],
      }
    : {}),
  ...getCommonExtraVars(values),
});

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
        balancers: {
          hosts:
            (!IS_EXPERT_MODE && values[LOAD_BALANCERS_FIELD_NAMES.IS_HAPROXY_ENABLED]) ||
            (IS_EXPERT_MODE &&
              values[LOAD_BALANCERS_FIELD_NAMES.IS_HAPROXY_ENABLED] &&
              values[LOAD_BALANCERS_FIELD_NAMES.IS_DEPLOY_TO_DATABASE_SERVERS])
              ? values[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS].reduce(
                  (acc, server) => ({
                    ...acc,
                    [server[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]]: {
                      ansible_host: server[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS],
                    },
                  }),
                  {},
                )
              : IS_EXPERT_MODE && !values[LOAD_BALANCERS_FIELD_NAMES.IS_DEPLOY_TO_DATABASE_SERVERS]
                ? values[LOAD_BALANCERS_FIELD_NAMES.DATABASES].reduce(
                    (acc, server) => ({
                      ...acc,
                      [server[LOAD_BALANCERS_FIELD_NAMES.DATABASES_ADDRESS]]: {
                        ansible_host: server[LOAD_BALANCERS_FIELD_NAMES.DATABASES_ADDRESS],
                      },
                    }),
                    {},
                  )
                : {},
        },
        etcd_cluster: {
          hosts:
            !IS_EXPERT_MODE ||
            (IS_EXPERT_MODE &&
              values[DCS_BLOCK_FIELD_NAMES.TYPE] === DCS_TYPES[0] &&
              values[DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_TO_DB_SERVERS])
              ? values[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS].reduce(
                  (acc, server) => ({
                    ...acc,
                    [server[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]]: {
                      ansible_host: server[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS],
                    },
                  }),
                  {},
                )
              : values[DCS_BLOCK_FIELD_NAMES.DATABASES].reduce(
                  (acc, server) => ({
                    ...acc,
                    [server[DCS_BLOCK_FIELD_NAMES.IP_ADDRESS]]: {
                      hostname: server[DCS_BLOCK_FIELD_NAMES.DATABASE_HOSTNAME],
                      ansible_host: server[DCS_BLOCK_FIELD_NAMES.IP_ADDRESS],
                    },
                  }),
                  {},
                ),
        },
        consul_instances: {
          hosts:
            IS_EXPERT_MODE &&
            !values[DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_TO_DB_SERVERS] &&
            values[DCS_BLOCK_FIELD_NAMES.TYPE] === DCS_TYPES[1]
              ? values[DCS_BLOCK_FIELD_NAMES.DATABASES].reduce(
                  (acc, server) => ({
                    ...acc,
                    [server[DCS_BLOCK_FIELD_NAMES.IP_ADDRESS]]: {
                      ansible_host: server[DCS_BLOCK_FIELD_NAMES.IP_ADDRESS],
                    },
                  }),
                  {},
                )
              : {},
        },
        master: {
          hosts: {
            [values[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS][0][DATABASE_SERVERS_FIELD_NAMES.IP_ADDRESS]]: {
              hostname:
                values[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS][0][
                  DATABASE_SERVERS_FIELD_NAMES.DATABASE_HOSTNAME
                ],
              ansible_host:
                values[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS][0][DATABASE_SERVERS_FIELD_NAMES.IP_ADDRESS],
              server_location:
                values[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS]?.[0]?.[DATABASE_SERVERS_FIELD_NAMES.LOCATION],
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
                    [server[DATABASE_SERVERS_FIELD_NAMES.IP_ADDRESS]]: {
                      hostname: server?.[DATABASE_SERVERS_FIELD_NAMES.DATABASE_HOSTNAME],
                      ansible_host: server?.[DATABASE_SERVERS_FIELD_NAMES.IP_ADDRESS],
                      server_location: server?.[DATABASE_SERVERS_FIELD_NAMES.LOCATION],
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
 * Functions creates an object with base cluster envs shared between cloud and local clusters.
 * @param values - Filled form values.
 */
export const getBaseClusterExtraVars = (values: ClusterFormValues) => {
  const extensions = IS_EXPERT_MODE
    ? (Object.entries(values?.[EXTENSION_BLOCK_FIELD_NAMES.EXTENSIONS])?.reduce((acc, [key, value]) => {
        if (value?.length) {
          const convertedToReqFormat = value.map((item) => ({
            ext: key,
            db: values[DATABASES_BLOCK_FIELD_NAMES.NAMES][item],
          }));
          return [...acc, ...convertedToReqFormat];
        }
        return acc;
      }, []) ?? [])
    : '';

  return {
    ...(IS_EXPERT_MODE
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
          database_public_access: !!values?.[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_DB_PUBLIC_ACCESS],
          cloud_load_balancer: !!values?.[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_CLOUD_LOAD_BALANCER],
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
          ...(extensions?.length ? { postgresql_extensions: extensions } : {}),
          ...(values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_METHOD]
            ? values[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_METHOD] === BACKUP_METHODS.PG_BACK_REST
              ? {
                  pgbackrest_install: true,
                  pgbackrest_backup_hour: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_START_TIME],
                  pgbackrest_retention_full: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION],
                  pgbackrest_retention_archive: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION],
                  ...(values?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG]
                    ? {
                        pgbackrest_conf: {
                          global: values?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG],
                        },
                      }
                    : {}),
                }
              : {
                  wal_g_install: true,
                  wal_g_backup_hour: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_START_TIME],
                  wal_g_retention_full: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION],
                  ...(values?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG]
                    ? {
                        wal_g_json: values?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG],
                      }
                    : {}),
                }
            : {}),
          ...(values?.[POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS]
            ? {
                local_postgresql_parameters: values[POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS],
              }
            : {}),
          ...(values?.[KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS]
            ? {
                sysctl_set: true,
                sysctl_conf: { postgres_cluster: values[KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS] },
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
      : {}),
  };
};

/**
 * Function converts passed object into format required by API for some fields ('key=value').
 * @param object - Passed parameters.
 */
const convertObjectToRequiredFormat = (object: Record<string, any>) => {
  return Object.entries(object).reduce((acc: string[], [key, value]) => {
    if (typeof object[key] === 'object') return [...acc, `${key}=${JSON.stringify(value)}`];
    return [...acc, `${key}=${value}`];
  }, []);
};

const convertObjectValueToBase64Format = (object: Record<string, any>) => {
  return Object.entries(object).reduce((acc: string[], [key, value]) => [...acc, `${key}=${btoa(value)}`], []);
};

const getRequestCloudParams = (values, secretsInfo, customExtraVars) => {
  return {
    envs: convertObjectValueToBase64Format({
      ...Object.fromEntries(
        Object.entries({
          ...secretsInfo,
        }).filter(([key]) => SECRET_MODAL_CONTENT_BODY_FORM_FIELDS?.[key]),
      ),
    }),
    extra_vars: convertObjectToRequiredFormat(
      customExtraVars ?? {
        ...getBaseClusterExtraVars(values),
        ...getCloudProviderExtraVars(values),
      },
    ),
  };
};

const getRequestLocalMachineParams = (values, secretId, customExtraVars) => {
  const baseClusterExtraVars = getBaseClusterExtraVars(values);
  const localMachineEnvs = getLocalMachineEnvs(values, secretId);
  const localMachineExtraVars = getLocalMachineExtraVars(values, secretId);

  return {
    envs: convertObjectValueToBase64Format(localMachineEnvs),
    extra_vars: convertObjectToRequiredFormat(customExtraVars ?? { ...baseClusterExtraVars, ...localMachineExtraVars }),
    existing_cluster: values[DATABASE_SERVERS_FIELD_NAMES.IS_CLUSTER_EXISTS] ?? false,
  };
};

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
  customExtraVars?: Record<string, any>;
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
