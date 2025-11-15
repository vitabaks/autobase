import { ReactElement } from 'react';

export interface ProvidersBlockProps {
  providers: { code?: string; description?: string }[];
}

export interface ClusterFormCloudProviderBoxProps {
  children?: ReactElement;
  isActive?: boolean;
  [key: string]: unknown;
}
