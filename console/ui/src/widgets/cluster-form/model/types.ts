import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { ResponseDeploymentInfo } from '@shared/api/api/deployments.ts';
import { ResponseEnvironment } from '@shared/api/api/environments.ts';
import { ResponsePostgresVersion } from '@shared/api/api/other.ts';

export interface ClusterFormProps {
  deploymentsData?: ResponseDeploymentInfo[];
  environmentsData?: ResponseEnvironment[];
  postgresVersionsData?: ResponsePostgresVersion[];
}

export interface ClusterFormRegionConfigBoxProps {
  name: string;
  place: string;
  isActive: boolean;
}

export interface ClusterDatabaseServer {
  [CLUSTER_FORM_FIELD_NAMES.HOSTNAME]: string;
  [CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]: string;
  [CLUSTER_FORM_FIELD_NAMES.LOCATION]: string;
}
