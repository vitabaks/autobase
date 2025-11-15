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
