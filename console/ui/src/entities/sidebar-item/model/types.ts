import { ComponentType, SVGProps } from 'react';

export interface SidebarItemProps {
  path: string;
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  isActive?: boolean;
  isCollapsed?: boolean;
  target?: string;
}
