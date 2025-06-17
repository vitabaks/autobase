import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';

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

export interface ClusterFormValues {
  [CLUSTER_FORM_FIELD_NAMES.PROVIDER]: {
    code: string;
    name: string;
  };
  [CLUSTER_FORM_FIELD_NAMES.ENVIRONMENT_ID]: number;
  [CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME]: string;
  [CLUSTER_FORM_FIELD_NAMES.DESCRIPTION]?: string;
  [CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION]: number;
  [CLUSTER_FORM_FIELD_NAMES.SECRET_ID]?: number;
  [CLUSTER_FORM_FIELD_NAMES.EXISTING_CLUSTER]: boolean;
  [CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS]: ClusterDatabaseServer[];
}
