import { CLUSTER_SECRET_MODAL_FORM_FIELD_NAMES } from '@features/cluster-secret-modal/model/constants.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import {
  DeploymentInfoCloudRegion,
  DeploymentInstanceType,
  ResponseDeploymentInfo,
} from '@shared/api/api/deployments.ts';
import { AUTHENTICATION_METHODS } from '@shared/model/constants.ts';
import { SecretFormValues } from '@entities/secret-form-block/model/types.ts';
import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';
import { BackupsBlockValues } from '@entities/cluster/expert-mode/backups-block/model/types.ts';
import { ExtensionsBlockValues } from '@entities/cluster/expert-mode/extensions-block/model/types.ts';
import { DatabasesBlockValues } from '@entities/cluster/expert-mode/databases-block/model/types.ts';
import { INSTANCES_BLOCK_FIELD_NAMES } from '@entities/cluster/instances-block/model/const.ts';
import { STORAGE_BLOCK_FIELDS } from '@entities/cluster/storage-block/model/const.ts';
import { SshKeyBlockValues } from '@entities/cluster/ssh-key-block/model/types.ts';
import { DcsBlockFormValues } from '@entities/cluster/expert-mode/dcs-block/model/types.ts';
import { DatabaseServerBlockValues } from '@entities/cluster/database-servers-block/model/types.ts';
import { DataDirectoryFormValues } from '@entities/cluster/expert-mode/data-directory-block/model/types.ts';
import { LoadBalancersBlockValues } from '@entities/cluster/load-balancers-block/model/types.ts';
import { ConnectionPoolBlockValues } from '@entities/cluster/expert-mode/connection-pools-block/model/types.ts';
import { AdditionalSettingsBlockValues } from '@entities/cluster/expert-mode/additional-settings-block/model/types.ts';
import { PostgresParametersBlockValues } from '@entities/cluster/expert-mode/postgres-parameters-block/model/types.ts';
import { KernelParametersBlockValues } from '@entities/cluster/expert-mode/kernel-parameters-block/model/types.ts';

export interface ClusterSecretModalProps {
  isClusterFormSubmitting?: boolean;
  isClusterFormDisabled?: boolean;
}

export interface ClusterSecretModalFormValues extends SecretFormValues {
  [CLUSTER_SECRET_MODAL_FORM_FIELD_NAMES.IS_SAVE_TO_CONSOLE]: boolean;
}

interface ClusterCloudProviderFormValues extends BackupsBlockValues, SshKeyBlockValues {
  [CLUSTER_FORM_FIELD_NAMES.REGION]?: string;
  [CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG]?: DeploymentInfoCloudRegion;
  [INSTANCES_BLOCK_FIELD_NAMES.INSTANCE_TYPE]?: 'small' | 'medium' | 'large' | 'custom';
  [CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG]?: DeploymentInstanceType;
  [CLUSTER_FORM_FIELD_NAMES.INSTANCES_AMOUNT]?: number;
  [STORAGE_BLOCK_FIELDS.STORAGE_AMOUNT]?: number;
  [CLUSTER_FORM_FIELD_NAMES.IS_SPOT_INSTANCES]?: boolean;
  [CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET]?: boolean;
}

interface ClusterLocalMachineProviderFormValues
  extends Pick<
      typeof SECRET_MODAL_CONTENT_FORM_FIELD_NAMES,
      | [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME]
      | [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.PASSWORD]
      | [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SSH_PRIVATE_KEY]
    >,
    LoadBalancersBlockValues,
    DatabaseServerBlockValues,
    DcsBlockFormValues {
  [CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD]?: (typeof AUTHENTICATION_METHODS)[keyof typeof AUTHENTICATION_METHODS];
  [CLUSTER_FORM_FIELD_NAMES.SECRET_KEY_NAME]?: string;
  [CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_IS_SAVE_TO_CONSOLE]?: boolean;
  [CLUSTER_FORM_FIELD_NAMES.CLUSTER_VIP_ADDRESS]?: string;
}

export interface ClusterFormValues
  extends ClusterCloudProviderFormValues,
    ClusterLocalMachineProviderFormValues,
    SecretFormValues,
    ExtensionsBlockValues,
    DatabasesBlockValues,
    DataDirectoryFormValues,
    ConnectionPoolBlockValues,
    AdditionalSettingsBlockValues,
    PostgresParametersBlockValues,
    KernelParametersBlockValues {
  [CLUSTER_FORM_FIELD_NAMES.CREATION_TYPE]: string;
  [CLUSTER_FORM_FIELD_NAMES.PROVIDER]: ResponseDeploymentInfo;
  [CLUSTER_FORM_FIELD_NAMES.ENVIRONMENT_ID]: number;
  [CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME]: string;
  [CLUSTER_FORM_FIELD_NAMES.DESCRIPTION]: string;
  [CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION]: number;
}
