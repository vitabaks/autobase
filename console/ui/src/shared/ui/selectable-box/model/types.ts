import { SxProps } from '@mui/material';
import { ReactNode } from 'react';

export interface ClusterFormSelectableBoxProps {
  children?: ReactNode;
  isActive?: boolean;
  sx?: SxProps;
  [key: string]: unknown;
}
