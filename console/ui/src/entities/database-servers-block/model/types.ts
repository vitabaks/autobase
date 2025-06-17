import { UseFieldArrayRemove } from 'react-hook-form';

export interface DatabaseServerBlockProps {
  index: number;
  onRemove?: () => void;
  disabled?: boolean;
}
