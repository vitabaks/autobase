import { DeploymentInstanceType } from '@/shared/api/api/deployments';

export interface CloudFormInstancesBlockProps {
  instances: {
    small?: DeploymentInstanceType[];
    medium?: DeploymentInstanceType[];
    large?: DeploymentInstanceType[];
  };
}
