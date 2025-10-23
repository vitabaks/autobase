import { AUTHENTICATION_METHODS, IS_EXPERT_MODE } from '@shared/model/constants.ts';
import { BACKUP_METHODS, BACKUPS_BLOCK_FIELD_NAMES } from '@entities/backups-block/model/const.ts';
import { ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES } from '@entities/additional-settings-block/model/const.ts';
import { POSTGRES_PARAMETERS_FIELD_NAMES } from '@entities/postgres-parameters-block/model/const.ts';
import { KERNEL_PARAMETERS_FIELD_NAMES } from '@entities/kernel-parameters-block/model/const.ts';
import { DATABASES_BLOCK_FIELD_NAMES } from '@entities/databases-block/model/const.ts';
import { CONNECTION_POOLS_BLOCK_FIELD_NAMES, POOL_MODES } from '@entities/connection-pools-block/model/const.ts';
import { INSTANCES_AMOUNT_BLOCK_VALUES } from '@entities/cluster-form-instances-amount-block/model/const.ts';
import { STORAGE_BLOCK_FIELDS } from '@entities/storage-block/model/const.ts';
import { EXTENSION_BLOCK_FIELD_NAMES } from '@entities/extensions-block/model/const.ts';

const CLUSTER_CLOUD_PROVIDER_FIELD_NAMES = Object.freeze({
  REGION: 'region',
  REGION_CONFIG: 'regionConfig',
  INSTANCE_TYPE: 'instanceType',
  INSTANCE_CONFIG: 'instanceConfig',
  STORAGE_AMOUNT: 'storageAmount',
  SSH_PUBLIC_KEY: 'sshPublicKey',
  ...INSTANCES_AMOUNT_BLOCK_VALUES,
  ...STORAGE_BLOCK_FIELDS,
  ...(IS_EXPERT_MODE
    ? {
        ...ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES,
      }
    : {}),
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
  ...(IS_EXPERT_MODE ? {} : {}),
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
  ...DATABASES_BLOCK_FIELD_NAMES,
  ...CONNECTION_POOLS_BLOCK_FIELD_NAMES,
  ...EXTENSION_BLOCK_FIELD_NAMES,
  ...BACKUPS_BLOCK_FIELD_NAMES,
  ...POSTGRES_PARAMETERS_FIELD_NAMES,
  ...KERNEL_PARAMETERS_FIELD_NAMES,
});

export const CLUSTER_FORM_DEFAULT_VALUES = Object.freeze({
  [CLUSTER_FORM_FIELD_NAMES.INSTANCES_AMOUNT]: 3,
  [CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD]: AUTHENTICATION_METHODS.SSH,
  [CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET]: false,
  [CLUSTER_FORM_FIELD_NAMES.SECRET_ID]: '',
  [CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS]: Array(3)
    .fill(0)
    .map(() => ({
      [CLUSTER_FORM_FIELD_NAMES.HOSTNAME]: '',
      [CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]: '',
      [CLUSTER_FORM_FIELD_NAMES.LOCATION]: '',
    })),
  ...(IS_EXPERT_MODE
    ? {
        [CLUSTER_FORM_FIELD_NAMES.IS_SPOT_INSTANCES]: false,
        [CLUSTER_FORM_FIELD_NAMES.IS_BACKUPS_ENABLED]: true,
        [CLUSTER_FORM_FIELD_NAMES.BACKUP_METHOD]: BACKUP_METHODS.PG_BACK_REST,
        [CLUSTER_FORM_FIELD_NAMES.BACKUP_RETENTION]: 1,
        [CLUSTER_FORM_FIELD_NAMES.BACKUP_START_TIME]: 1,
        [ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.SYNC_STANDBY_NODES]: 1,
        [ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_CLOUD_LOAD_BALANCER]: true,
        [ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_NETDATA_MONITORING]: true,
        [CLUSTER_FORM_FIELD_NAMES.DATABASES]: [
          {
            [CLUSTER_FORM_FIELD_NAMES.DATABASE_NAME]: 'db1',
            [CLUSTER_FORM_FIELD_NAMES.USER_NAME]: '',
            [CLUSTER_FORM_FIELD_NAMES.USER_PASSWORD]: '',
            [CLUSTER_FORM_FIELD_NAMES.ENCODING]: 'UTF8',
            [CLUSTER_FORM_FIELD_NAMES.LOCALE]: 'en_US.UTF-8',
          },
        ],
        [CLUSTER_FORM_FIELD_NAMES.IS_CONNECTION_POOLER_ENABLED]: true,
        [CLUSTER_FORM_FIELD_NAMES.POOLS]: [
          {
            [CLUSTER_FORM_FIELD_NAMES.POOL_NAME]: 'db1',
            [CLUSTER_FORM_FIELD_NAMES.POOL_SIZE]: 20,
            [CLUSTER_FORM_FIELD_NAMES.POOL_MODE]: POOL_MODES[0],
          },
        ],
      }
    : {}),
});
