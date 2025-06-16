import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InputAdornment, MenuItem, Stack, TextField, useTheme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { OperationsTableButtonsProps } from '@features/operations-table-buttons/model/types.ts';
import CalendarClockIcon from '@shared/assets/calendarClockICon.svg?react';
import {
  getOperationsDateRangeVariants,
  getOperationsTimeNameValue,
} from '@features/operations-table-buttons/lib/functions.ts';

const OperationsTableButtons: FC<OperationsTableButtonsProps> = ({ refetch, startDate, setStartDate }) => {
  const { t } = useTranslation('operations');
  const theme = useTheme();

  const rangeOptions = getOperationsDateRangeVariants(t);

  const handleChange = (e) => {
    setStartDate(getOperationsTimeNameValue(e.target.value));
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" gap="4px">
      <TextField
        select
        size="small"
        variant="standard"
        value={startDate.name}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CalendarClockIcon width="24px" height="24px" style={{ fill: theme.palette.text.primary }} />
            </InputAdornment>
          ),
        }}>
        {rangeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Button onClick={handleRefresh} startIcon={<RefreshIcon />} variant="text">
        {t('refresh', { ns: 'shared' })}
      </Button>
    </Stack>
  );
};

export default OperationsTableButtons;
