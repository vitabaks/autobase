import { AUTHENTICATION_METHODS, IS_EXPERT_MODE } from '@shared/model/constants.ts';
import { BACKUP_METHODS, BACKUPS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/backups-block/model/const.ts';
import { ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/additional-settings-block/model/const.ts';
import { POSTGRES_PARAMETERS_FIELD_NAMES } from '@entities/cluster/expert-mode/postgres-parameters-block/model/const.ts';
import { KERNEL_PARAMETERS_FIELD_NAMES } from '@entities/cluster/expert-mode/kernel-parameters-block/model/const.ts';
import { DATABASES_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/databases-block/model/const.ts';
import {
  CONNECTION_POOLS_BLOCK_FIELD_NAMES,
  POOL_MODES,
} from '@entities/cluster/expert-mode/connection-pools-block/model/const.ts';
import { INSTANCES_AMOUNT_BLOCK_VALUES } from '@entities/cluster/instances-amount-block/model/const.ts';
import { STORAGE_BLOCK_FIELDS } from '@entities/cluster/storage-block/model/const.ts';
import { EXTENSION_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/extensions-block/model/const.ts';
import { NETWORK_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/network-block/model/const.ts';
import { INSTANCES_BLOCK_FIELD_NAMES } from '@entities/cluster/instances-block/model/const.ts';
import {
  LOAD_BALANCERS_DATABASES_DEFAULT_VALUES,
  LOAD_BALANCERS_FIELD_NAMES,
} from '@entities/cluster/load-balancers-block/model/const.ts';
import {
  DCS_BLOCK_FIELD_NAMES,
  DCS_DATABASES_DEFAULT_VALUES,
  DCS_TYPES,
} from '@entities/cluster/expert-mode/dcs-block/model/const.ts';
import { DATA_DIRECTORY_FIELD_NAMES } from '@entities/cluster/expert-mode/data-directory-block/model/const.ts';
import { DATABASE_SERVERS_FIELD_NAMES } from '@entities/cluster/database-servers-block/model/const.ts';
import { uniqueId } from 'lodash';

export const CLUSTER_CREATION_TYPES = Object.freeze({
  FORM: 'form',
  YAML: 'yaml',
});

const CLUSTER_CLOUD_PROVIDER_FIELD_NAMES = Object.freeze({
  REGION: 'region',
  REGION_CONFIG: 'regionConfig',
  INSTANCE_TYPE: 'instanceType',
  INSTANCE_CONFIG: 'instanceConfig',
  SSH_PUBLIC_KEY: 'sshPublicKey',
  ...INSTANCES_AMOUNT_BLOCK_VALUES,
  ...STORAGE_BLOCK_FIELDS,
});

const CLUSTER_LOCAL_MACHINE_FIELD_NAMES = Object.freeze({
  EXISTING_CLUSTER: 'existingCluster',
  AUTHENTICATION_METHOD: 'authenticationMethod',
  SECRET_KEY_NAME: 'secretKeyName',
  AUTHENTICATION_IS_SAVE_TO_CONSOLE: 'authenticationSaveToConsole',
  CLUSTER_VIP_ADDRESS: 'clusterVIPAddress',
  IS_USE_DEFINED_SECRET: 'isUseDefinedSecret',
  ...LOAD_BALANCERS_FIELD_NAMES,
  ...DATABASE_SERVERS_FIELD_NAMES,
  ...DCS_BLOCK_FIELD_NAMES,
  ...DATA_DIRECTORY_FIELD_NAMES,
});

export const CLUSTER_FORM_FIELD_NAMES = Object.freeze({
  PROVIDER: 'provider',
  ENVIRONMENT_ID: 'environment',
  CLUSTER_NAME: 'clusterName',
  DESCRIPTION: 'description',
  POSTGRES_VERSION: 'postgresVersion',
  SECRET_ID: 'secretId',
  CREATION_TYPE: 'creationType',
  ...CLUSTER_CLOUD_PROVIDER_FIELD_NAMES,
  ...CLUSTER_LOCAL_MACHINE_FIELD_NAMES,
  ...DATABASES_BLOCK_FIELD_NAMES,
  ...CONNECTION_POOLS_BLOCK_FIELD_NAMES,
  ...EXTENSION_BLOCK_FIELD_NAMES,
  ...BACKUPS_BLOCK_FIELD_NAMES,
  ...POSTGRES_PARAMETERS_FIELD_NAMES,
  ...KERNEL_PARAMETERS_FIELD_NAMES,
});

export const CLOUD_CLUSTER_DEFAULT_VALUES = Object.freeze({
  [INSTANCES_AMOUNT_BLOCK_VALUES.INSTANCES_AMOUNT]: 3,
  [INSTANCES_BLOCK_FIELD_NAMES.INSTANCE_TYPE]: 'small',
  [STORAGE_BLOCK_FIELDS.STORAGE_AMOUNT]: 100,
  ...(IS_EXPERT_MODE
    ? {
        [INSTANCES_BLOCK_FIELD_NAMES.SERVER_TYPE]: '',
        [NETWORK_BLOCK_FIELD_NAMES.SERVER_NETWORK]: '',
        [INSTANCES_AMOUNT_BLOCK_VALUES.IS_SPOT_INSTANCES]: false,
        [STORAGE_BLOCK_FIELDS.FILE_SYSTEM_TYPE]: 'ext4',
        [ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_CLOUD_LOAD_BALANCER]: true,
      }
    : {}),
});

export const LOCAL_CLUSTER_DEFAULT_VALUES = Object.freeze({
  [CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD]: AUTHENTICATION_METHODS.SSH,
  ...(IS_EXPERT_MODE
    ? {
        [DCS_BLOCK_FIELD_NAMES.TYPE]: DCS_TYPES.ETCD,
        [DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_NEW_CLUSTER]: true,
        [DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_TO_DB_SERVERS]: true,
        [DCS_BLOCK_FIELD_NAMES.DCS_DATABASES]: Array(3)
          .fill(0)
          .map(() => DCS_DATABASES_DEFAULT_VALUES),
        [LOAD_BALANCERS_FIELD_NAMES.IS_DEPLOY_TO_DATABASE_SERVERS]: false,
        [LOAD_BALANCERS_FIELD_NAMES.DATABASES]: [LOAD_BALANCERS_DATABASES_DEFAULT_VALUES],
        [DATA_DIRECTORY_FIELD_NAMES.DATA_DIRECTORY]: '/pgdata/18/main',
      }
    : {}),
});

export const CLUSTER_FORM_DEFAULT_VALUES = Object.freeze({
  ...CLOUD_CLUSTER_DEFAULT_VALUES,
  ...LOCAL_CLUSTER_DEFAULT_VALUES,
  [CLUSTER_FORM_FIELD_NAMES.DESCRIPTION]: '',
  [CLUSTER_FORM_FIELD_NAMES.CREATION_TYPE]: CLUSTER_CREATION_TYPES.FORM,
  [CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET]: false,
  [CLUSTER_FORM_FIELD_NAMES.SECRET_ID]: '',
  [DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS]: Array(3)
    .fill(0)
    .map(() => ({
      [DATABASE_SERVERS_FIELD_NAMES.DATABASE_HOSTNAME]: '',
      [DATABASE_SERVERS_FIELD_NAMES.DATABASE_IP_ADDRESS]: '',
      [DATABASE_SERVERS_FIELD_NAMES.DATABASE_LOCATION]: '',
    })),
  ...(IS_EXPERT_MODE
    ? {
        [BACKUPS_BLOCK_FIELD_NAMES.IS_BACKUPS_ENABLED]: true,
        [BACKUPS_BLOCK_FIELD_NAMES.BACKUP_METHOD]: BACKUP_METHODS.PG_BACK_REST,
        [BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION]: 30,
        [BACKUPS_BLOCK_FIELD_NAMES.BACKUP_START_TIME]: 1,
        [BACKUPS_BLOCK_FIELD_NAMES.CONFIG]: '',
        [BACKUPS_BLOCK_FIELD_NAMES.ACCESS_KEY]: '',
        [BACKUPS_BLOCK_FIELD_NAMES.SECRET_KEY]: '',
        [POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS]: '',
        [KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS]: '',
        [DATABASES_BLOCK_FIELD_NAMES.DATABASES]: [
          {
            [DATABASES_BLOCK_FIELD_NAMES.DATABASE_NAME]: 'db1',
            [DATABASES_BLOCK_FIELD_NAMES.USER_NAME]: 'user1',
            [DATABASES_BLOCK_FIELD_NAMES.USER_PASSWORD]: '',
            [DATABASES_BLOCK_FIELD_NAMES.ENCODING]: 'UTF8',
            [DATABASES_BLOCK_FIELD_NAMES.LOCALE]: 'en_US.UTF-8',
            [DATABASES_BLOCK_FIELD_NAMES.BLOCK_ID]: uniqueId(),
          },
        ],
        [CONNECTION_POOLS_BLOCK_FIELD_NAMES.IS_CONNECTION_POOLER_ENABLED]: true,
        [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS]: [
          {
            [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_NAME]: 'db1',
            [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_SIZE]: 20,
            [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_MODE]: POOL_MODES[0].option,
          },
        ],
        [EXTENSION_BLOCK_FIELD_NAMES.EXTENSIONS]: {},
        [ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.SYNC_STANDBY_NODES]: 0,
        [ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.IS_NETDATA_MONITORING]: true,
      }
    : {}),
});
