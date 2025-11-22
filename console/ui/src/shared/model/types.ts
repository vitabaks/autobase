import { MRT_Row, MRT_RowData } from 'material-react-table';

export interface TableRowActionsProps {
  closeMenu: () => void;
  row: MRT_Row<MRT_RowData>;
}

export type valueOf<T> = T[keyof T];
