import { RequestClusterCreate } from '@shared/api/api/clusters.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDER_CODE_TO_ANSIBLE_USER_MAP } from '@features/cluster-secret-modal/model/constants.ts';
import { AUTHENTICATION_METHODS, IS_EXPERT_MODE } from '@shared/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import { ClusterFormValues } from '@features/cluster-secret-modal/model/types.ts';

import {
  SECRET_MODAL_CONTENT_BODY_FORM_FIELDS,
  SECRET_MODAL_CONTENT_FORM_FIELD_NAMES,
} from '@entities/secret-form-block/model/constants.ts';
import { DATABASES_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/databases-block/model/const.ts';
import { CONNECTION_POOLS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/connection-pools-block/model/const.ts';
import { BACKUPS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/backups-block/model/const.ts';
import { POSTGRES_PARAMETERS_FIELD_NAMES } from '@entities/cluster/expert-mode/postgres-parameters-block/model/const.ts';
import { KERNEL_PARAMETERS_FIELD_NAMES } from '@entities/cluster/expert-mode/kernel-parameters-block/model/const.ts';
import { ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/additional-settings-block/model/const.ts';
import { INSTANCES_AMOUNT_BLOCK_VALUES } from '@entities/cluster/instances-amount-block/model/const.ts';
import { STORAGE_BLOCK_FIELDS } from '@entities/cluster/storage-block/model/const.ts';
import { EXTENSION_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/extensions-block/model/const.ts';
import { NETWORK_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/network-block/model/const.ts';
import { INSTANCES_BLOCK_FIELD_NAMES } from '@entities/cluster/instances-block/model/const.ts';
import { LOAD_BALANCERS_FIELD_NAMES } from '@entities/cluster/load-balancers-block/model/const.ts';
import { DATABASE_SERVERS_FIELD_NAMES } from '@entities/cluster/database-servers-block/model/const.ts';
import { SSH_KEY_BLOCK_FIELD_NAMES } from '@entities/cluster/ssh-key-block/model/const.ts';

export const getCommonExtraVars = (values: ClusterFormValues) => ({
  postgresql_version: values[CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION],
  patroni_cluster_name: values[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME],
});

export const getCloudProviderExtraVars = (values: ClusterFormValues) => ({
  cloud_provider: values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code,
  server_type: values[CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG].code,
  server_location: values[CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG].code,
  server_count: values[CLUSTER_FORM_FIELD_NAMES.INSTANCES_AMOUNT],
  volume_size: values[STORAGE_BLOCK_FIELDS.STORAGE_AMOUNT],
  ssh_public_keys: values[SSH_KEY_BLOCK_FIELD_NAMES.SSH_PUBLIC_KEY]?.split('\n').map((key) => `'${key}'`) ?? '', // value should be required in form, allow undefined only for YAML editor to work correctly
  ansible_user: PROVIDER_CODE_TO_ANSIBLE_USER_MAP[values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code],
  ...getCommonExtraVars(values),
  ...values[CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG].cloud_image.image,
});

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
  ...getCommonExtraVars(values),
});

export const getLocalMachineEnvs = (values: ClusterFormValues, secretId?: number) => ({
  ...(values[CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD] === AUTHENTICATION_METHODS.SSH &&
  !values[CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET] &&
  !secretId
    ? {
        SSH_PRIVATE_KEY_CONTENT: btoa(values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SSH_PRIVATE_KEY]),
      }
    : {}),
  ANSIBLE_INVENTORY_JSON: btoa(
    JSON.stringify({
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
            hosts: values[LOAD_BALANCERS_FIELD_NAMES.IS_HAPROXY_ENABLED]
              ? values[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS].reduce(
                  (acc, server) => ({
                    ...acc,
                    [server[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]]: {
                      ansible_host: server[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS],
                    },
                  }),
                  {},
                )
              : {},
          },
          consul_instances: {
            hosts: {},
          },
          etcd_cluster: {
            hosts: values[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS].reduce(
              (acc, server) => ({
                ...acc,
                [server[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]]: {
                  ansible_host: server[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS],
                },
              }),
              {},
            ),
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
                postgresql_exists: values[DATABASE_SERVERS_FIELD_NAMES.IS_CLUSTER_EXISTS] ?? false,
              },
            },
          },
          ...(values[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS].length > 1
            ? {
                replica: {
                  hosts: values[DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS].slice(1).reduce(
                    (acc, server) => ({
                      ...acc,
                      [server.ipAddress]: {
                        hostname: server?.[DATABASE_SERVERS_FIELD_NAMES.DATABASE_HOSTNAME],
                        ansible_host: server?.[DATABASE_SERVERS_FIELD_NAMES.IP_ADDRESS],
                        server_location: server?.[DATABASE_SERVERS_FIELD_NAMES.LOCATION],
                        postgresql_exists: values[DATABASE_SERVERS_FIELD_NAMES.IS_CLUSTER_EXISTS] ?? false,
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
    }),
  ),
});

const convertObjectToRequiredFormat = (object: Record<any, any>) => {
  return Object.entries(object).reduce((acc: string[], [key, value]) => [...acc, `${key}=${value}`], []);
};

export const mapFormValuesToRequestFields = ({
  values,
  secretId,
  projectId,
  envs,
}: {
  values: ClusterFormValues;
  secretId?: number;
  projectId: number;
  envs?: object;
}): RequestClusterCreate => {
  const baseCloudClusterObject = {
    project_id: projectId,
    name: values[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME],
    environment_id: values[CLUSTER_FORM_FIELD_NAMES.ENVIRONMENT_ID],
    description: values[CLUSTER_FORM_FIELD_NAMES.DESCRIPTION],
    ...(secretId ? { auth_info: { secret_id: secretId } } : {}),
    ...(values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code === PROVIDERS.LOCAL
      ? { envs: convertObjectToRequiredFormat(getLocalMachineEnvs(values, secretId)) }
      : envs && values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code !== PROVIDERS.LOCAL
        ? {
            envs: convertObjectToRequiredFormat(
              Object.fromEntries(Object.entries(envs).filter(([key]) => SECRET_MODAL_CONTENT_BODY_FORM_FIELDS?.[key])),
            ),
          }
        : {}),
    extra_vars: convertObjectToRequiredFormat(
      values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code === PROVIDERS.LOCAL
        ? getLocalMachineExtraVars(values, secretId)
        : getCloudProviderExtraVars(values),
    ),
    existing_cluster: values[DATABASE_SERVERS_FIELD_NAMES.IS_CLUSTER_EXISTS] ?? false,
  };

  if (IS_EXPERT_MODE) {
    const fromInstanceType = {
      server_type: values[INSTANCES_BLOCK_FIELD_NAMES.SERVER_TYPE],
    };

    const fromDataDiskStorage = {
      server_network: values[NETWORK_BLOCK_FIELD_NAMES.SERVER_NETWORK],
    };

    const fromInstancesAmountBlock =
      [PROVIDERS.AWS, PROVIDERS.GCP, PROVIDERS.AZURE].includes(values[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code) &&
      !!values[INSTANCES_AMOUNT_BLOCK_VALUES.IS_SPOT_INSTANCES]
        ? {
            server_spot: true,
          }
        : {};

    const fromStorageAmountBlock = {
      pg_data_mount_fstype: values[STORAGE_BLOCK_FIELDS.FILE_SYSTEM_TYPE],
      volume_type: values[STORAGE_BLOCK_FIELDS.VOLUME_TYPE],
    };

    const fromDatabasesBlock = {
      postgresql_databases: values[DATABASES_BLOCK_FIELD_NAMES.DATABASES].map((db) => ({
        db: db?.[DATABASES_BLOCK_FIELD_NAMES.DATABASE_NAME],
        owner: db?.[DATABASES_BLOCK_FIELD_NAMES.USER_NAME],
        lc_ctype: db?.[DATABASES_BLOCK_FIELD_NAMES.LOCALE],
        lc_collate: db?.[DATABASES_BLOCK_FIELD_NAMES.LOCALE],
      })),
      postgresql_users: values[DATABASES_BLOCK_FIELD_NAMES.DATABASES].map((db) => ({
        name: db?.[DATABASES_BLOCK_FIELD_NAMES.USER_NAME],
        password: db?.[DATABASES_BLOCK_FIELD_NAMES.USER_PASSWORD],
      })),
    };

    const fromConnectionPoolsBlock = {
      pgbouncer_install: !!values[CONNECTION_POOLS_BLOCK_FIELD_NAMES.IS_CONNECTION_POOLER_ENABLED],
      ...(!!values[CONNECTION_POOLS_BLOCK_FIELD_NAMES.IS_CONNECTION_POOLER_ENABLED] // do not add pools info if connection pooler is disabled
        ? {
            pgbouncer_pools: values?.[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS].map((pool) => ({
              name: pool?.[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_NAME],
              dbname: pool?.[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_NAME],
              pool_parameters: {
                pool_size: pool?.[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_SIZE],
                pool_mode: pool?.[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_MODE],
              },
            })),
          }
        : {}),
    };

    const fromExtensionsBlock = {
      postgresql_extensions: Object.entries(values?.[EXTENSION_BLOCK_FIELD_NAMES.EXTENSIONS]).reduce(
        (acc, [key, value]) => {
          if (value.length) {
            const convertedToReqFormat = value.map((item) => ({
              ext: key,
              db: values[DATABASES_BLOCK_FIELD_NAMES.NAMES][item],
            }));
            return [...acc, ...convertedToReqFormat];
          }
          return acc;
        },
        [],
      ),
    };

    const fromBackupPoolsBlock = {
      ...(values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_METHOD]
        ? values[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_METHOD] === 'pgbackrest_install'
          ? {
              pgbackrest_install: true,
              PGBACKREST_BACKUP_HOUR: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_START_TIME],
              PGBACKREST_RETENTION_FULL: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION],
              PGBACKREST_RETENTION_ARCHIVE: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION],
              pgbackrest_conf: {
                global: values?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL],
              },
            }
          : {
              wal_g_install: true,
              WALG_BACKUP_HOUR: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_START_TIME],
              WAL_G_RETENTION_FULL: values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION],
              wal_g_json: values?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL],
            }
        : {}),
    };

    const fromPostgresParametersBlock = {
      local_postgresql_parameters: values?.[POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS],
      ...(values?.[KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS]
        ? {
            sysctl_set: true,
            sysctl_conf: values[KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS],
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
    };

    const fromAdditionalSettingsBlock = {
      ...(values[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.SYNC_STANDBY_NODES]
        ? {
            synchronous_mode: true,
            synchronous_node_count: values[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.SYNC_STANDBY_NODES],
            synchronous_mode_strict: !!values?.[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_SYNC_MODE_STRICT],
          }
        : {}),
      database_public_access: !!values?.[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_DB_PUBLIC_ACCESS],
      cloud_load_balancer: !!values?.[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_CLOUD_LOAD_BALANCER],
      netdata_install: !!values?.[ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_NETDATA_MONITORING],
    };

    return {
      ...(values?.[INSTANCES_BLOCK_FIELD_NAMES.INSTANCE_TYPE] === 'custom' ? { ...fromInstanceType } : {}),
      ...fromDataDiskStorage,
      ...baseCloudClusterObject,
      ...fromInstancesAmountBlock,
      ...fromStorageAmountBlock,
      ...fromDatabasesBlock,
      ...fromConnectionPoolsBlock,
      ...fromExtensionsBlock,
      ...fromBackupPoolsBlock,
      ...fromPostgresParametersBlock,
      ...fromAdditionalSettingsBlock,
    };
  }

  return baseCloudClusterObject;
};
