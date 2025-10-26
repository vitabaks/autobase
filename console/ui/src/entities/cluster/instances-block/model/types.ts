import { DeploymentInstanceType } from '@shared/api/api/other.ts';

export interface CloudFormInstancesBlockProps {
  instances: {
    small?: DeploymentInstanceType[];
    medium?: DeploymentInstanceType[];
    large?: DeploymentInstanceType[];
  };
}
