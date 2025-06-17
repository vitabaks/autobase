import { CLUSTER_SECRET_MODAL_FORM_FIELD_NAMES } from '@features/cluster-secret-modal/model/constants.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import {
  DeploymentInfoCloudRegion,
  DeploymentInstanceType,
  ResponseDeploymentInfo,
} from '@shared/api/api/deployments.ts';
import { AUTHENTICATION_METHODS } from '@shared/model/constants.ts';
import { ClusterDatabaseServer } from '@widgets/cluster-form/model/types.ts';
import { SecretFormValues } from '@entities/secret-form-block/model/types.ts';
import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';

export interface ClusterSecretModalProps {
  isClusterFormSubmitting?: boolean;
  isClusterFormDisabled?: boolean;
}

export interface ClusterSecretModalFormValues extends SecretFormValues {
  [CLUSTER_SECRET_MODAL_FORM_FIELD_NAMES.IS_SAVE_TO_CONSOLE]: boolean;
}

interface ClusterCloudProviderFormValues {
  [CLUSTER_FORM_FIELD_NAMES.REGION]?: string;
  [CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG]?: DeploymentInfoCloudRegion;
  [CLUSTER_FORM_FIELD_NAMES.INSTANCE_TYPE]?: ['small', 'medium', 'large'];
  [CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG]?: DeploymentInstanceType;
  [CLUSTER_FORM_FIELD_NAMES.INSTANCES_AMOUNT]?: number;
  [CLUSTER_FORM_FIELD_NAMES.STORAGE_AMOUNT]?: number;
  [CLUSTER_FORM_FIELD_NAMES.SSH_PUBLIC_KEY]?: string;
}

interface ClusterLocalMachineProviderFormValues
  extends Pick<
    SECRET_MODAL_CONTENT_FORM_FIELD_NAMES,
    | SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME
    | SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.PASSWORD
    | SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.PRIVATE_KEY
  > {
  [CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS]?: ClusterDatabaseServer[];
  [CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD]?: typeof AUTHENTICATION_METHODS;
  [CLUSTER_FORM_FIELD_NAMES.SECRET_KEY_NAME]?: string;
  [CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_IS_SAVE_TO_CONSOLE]?: boolean;
  [CLUSTER_FORM_FIELD_NAMES.CLUSTER_VIP_ADDRESS]?: string;
  [CLUSTER_FORM_FIELD_NAMES.IS_HAPROXY_LOAD_BALANCER]?: boolean;
}

export interface ClusterFormValues extends ClusterCloudProviderFormValues, ClusterLocalMachineProviderFormValues {
  [CLUSTER_FORM_FIELD_NAMES.PROVIDER]: ResponseDeploymentInfo;
  [CLUSTER_FORM_FIELD_NAMES.ENVIRONMENT_ID]: number;
  [CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME]: string;
  [CLUSTER_FORM_FIELD_NAMES.DESCRIPTION]: string;
  [CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION]: number;
  [CLUSTER_FORM_FIELD_NAMES.EXISTING_CLUSTER]: boolean;
}
