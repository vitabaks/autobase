import { ReactNode } from 'react';

export interface ConnectionInfoProps {
  connectionInfo?: {
    address?: string | Record<string, string>;
    port?: string | Record<string, string>;
    superuser?: string;
    password?: string;
  };
}

export interface ConnectionInfoRowContainerProps {
  children: ReactNode;
}
