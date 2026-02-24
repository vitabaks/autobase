import { ReactNode } from 'react';

export interface ConnectionInfoProps {
  connectionInfo?: {
    address?: string | Record<string, string>;
    port?: string | Record<string, string>;
    superuser?: string;
    password?: string;
  };
  /** Fallback server list when connection_info is not set (e.g. imported clusters) */
  servers?: { ip?: string; name?: string; role?: string }[];
}

export interface ConnectionInfoRowContainerProps {
  children: ReactNode;
}
