export interface OperationsDateRange {
  name: string;
  value: string;
}

export interface OperationsTableButtonsProps {
  refetch: () => void;
  startDate: OperationsDateRange;
  setStartDate: (date: OperationsDateRange) => void;
}
