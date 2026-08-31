import { TFunction } from 'i18next';
import { FieldErrors } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { DATABASE_SERVERS_FIELD_NAMES } from '@entities/cluster/database-servers-block/model/const.ts';
import { LOAD_BALANCERS_FIELD_NAMES } from '@entities/cluster/load-balancers-block/model/const.ts';
import { DCS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/dcs-block/model/const.ts';
import { BACKUPS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/backups-block/model/const.ts';
import { CONNECTION_POOLS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/connection-pools-block/model/const.ts';
import { DATABASES_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/databases-block/model/const.ts';
import { ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/additional-settings-block/model/const.ts';
import { POSTGRES_PARAMETERS_FIELD_NAMES } from '@entities/cluster/expert-mode/postgres-parameters-block/model/const.ts';
import { KERNEL_PARAMETERS_FIELD_NAMES } from '@entities/cluster/expert-mode/kernel-parameters-block/model/const.ts';
import { DATA_DIRECTORY_FIELD_NAMES } from '@entities/cluster/expert-mode/data-directory-block/model/const.ts';
import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';

export interface ClusterFormValidationError {
  path: string;
  label: string;
  message: string;
}

interface ErrorLeaf {
  path: string[];
  message: string;
}

const collectErrorLeaves = (node: unknown, path: string[] = []): ErrorLeaf[] => {
  if (!node || typeof node !== 'object') return [];

  if ('message' in node && typeof node.message === 'string') {
    return [{ path, message: node.message }];
  }

  return Object.entries(node).flatMap(([key, value]) => collectErrorLeaves(value, [...path, key]));
};

const getFieldLabels = (t: TFunction): Record<string, string> => ({
  [CLUSTER_FORM_FIELD_NAMES.PROVIDER]: t('selectDeploymentDestination'),
  [CLUSTER_FORM_FIELD_NAMES.REGION]: t('selectCloudRegion'),
  [CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG]: t('selectCloudRegion'),
  [CLUSTER_FORM_FIELD_NAMES.INSTANCE_TYPE]: t('instanceType'),
  [CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG]: t('instanceType'),
  [CLUSTER_FORM_FIELD_NAMES.INSTANCES_AMOUNT]: t('numberOfInstances'),
  [CLUSTER_FORM_FIELD_NAMES.STORAGE_AMOUNT]: t('dataDiskStorage'),
  [CLUSTER_FORM_FIELD_NAMES.SSH_PUBLIC_KEY]: t('sshPublicKey'),
  [CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD]: t('authenticationMethod'),
  [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SSH_PRIVATE_KEY]: t('sshKey'),
  [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME]: t('username', { ns: 'shared' }),
  [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.PASSWORD]: t('password', { ns: 'shared' }),
  [CLUSTER_FORM_FIELD_NAMES.SECRET_KEY_NAME]: t('secretName', { ns: 'settings' }),
  [CLUSTER_FORM_FIELD_NAMES.SECRET_ID]: t('secret', { ns: 'settings' }),
  [CLUSTER_FORM_FIELD_NAMES.CLUSTER_VIP_ADDRESS]: t('clusterVipAddress'),
  [CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME]: t('clusterName'),
  [CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION]: t('postgresVersion'),
  [DATABASE_SERVERS_FIELD_NAMES.DATABASE_HOSTNAME]: t('hostname'),
  [DATABASE_SERVERS_FIELD_NAMES.DATABASE_IP_ADDRESS]: t('ipAddress'),
  [DATABASE_SERVERS_FIELD_NAMES.DATABASE_SSH_PORT]: t('sshPort'),
  [LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES_HOSTNAME]: t('hostname'),
  [LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES_IP_ADDRESS]: t('ipAddress'),
  [LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES_SSH_PORT]: t('sshPort'),
  [DCS_BLOCK_FIELD_NAMES.TYPE]: t('dcsType'),
  [DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_HOSTNAME]: t('hostname'),
  [DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_IP_ADDRESS]: t('ipAddress'),
  [DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_SSH_PORT]: t('sshPort'),
  [DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_PORT]: t('port'),
  [BACKUPS_BLOCK_FIELD_NAMES.CONFIG]: t('backupConfiguration'),
  [BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION]: t('backupRetention'),
  [BACKUPS_BLOCK_FIELD_NAMES.ACCESS_KEY]: t('accessKey'),
  [BACKUPS_BLOCK_FIELD_NAMES.SECRET_KEY]: t('secretKey'),
  [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_NAME]: t('poolName'),
  [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_SIZE]: t('poolSize'),
  [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_MODE]: t('poolMode'),
  [DATABASES_BLOCK_FIELD_NAMES.DATABASE_NAME]: t('databaseName'),
  [DATABASES_BLOCK_FIELD_NAMES.USER_NAME]: t('username', { ns: 'shared' }),
  [DATABASES_BLOCK_FIELD_NAMES.USER_PASSWORD]: t('userPassword', { ns: 'shared' }),
  [DATABASES_BLOCK_FIELD_NAMES.ENCODING]: t('encoding'),
  [DATABASES_BLOCK_FIELD_NAMES.LOCALE]: t('locale', { ns: 'shared' }),
  [ADDITIONAL_SETTINGS_BLOCK_FIELD_NAMES.SYNC_STANDBY_NODES]: t('syncStandbyNodes'),
  [POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS]: t('postgresParameters'),
  [KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS]: t('kernelParameters'),
  [DATA_DIRECTORY_FIELD_NAMES.DATA_DIRECTORY]: t('dataDirectory'),
});

const getArrayContext = (path: string[], t: TFunction): string | undefined => {
  const arrayContexts: Record<string, string> = {
    [DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS]: 'databaseServerNumber',
    [LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES]: 'loadBalancerNumber',
    [DCS_BLOCK_FIELD_NAMES.DCS_DATABASES]: 'dcsServerNumber',
    [DATABASES_BLOCK_FIELD_NAMES.DATABASES]: 'databaseNumber',
    [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS]: 'connectionPoolNumber',
  };

  for (let index = path.length - 2; index >= 0; index -= 1) {
    const translationKey = arrayContexts[path[index]];
    const itemIndex = Number(path[index + 1]);
    if (translationKey && Number.isInteger(itemIndex)) {
      return t(translationKey, { number: itemIndex + 1 });
    }
  }

  return undefined;
};

export const getClusterFormValidationErrors = (
  errors: FieldErrors,
  t: TFunction,
): ClusterFormValidationError[] => {
  const fieldLabels = getFieldLabels(t);

  return collectErrorLeaves(errors).map(({ path, message }) => {
    const fieldName = path.at(-1) ?? '';
    const fieldLabel = fieldLabels[fieldName] ?? fieldName;
    const context = getArrayContext(path, t);

    return {
      path: path.join('.'),
      label: context ? `${context} — ${fieldLabel}` : fieldLabel,
      message,
    };
  });
};
