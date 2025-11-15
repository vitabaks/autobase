import { ClusterFormSelectableBoxProps } from '@shared/ui/selectable-box/model/types.ts';

export interface ClusterFromInstanceConfigBoxProps extends ClusterFormSelectableBoxProps {
  name: string;
  cpu: string;
  ram: string;
}
