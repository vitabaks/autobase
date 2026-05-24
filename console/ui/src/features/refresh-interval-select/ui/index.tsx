import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@app/redux/store/hooks.ts';
import {
  PollingContext,
  POLLING_INTERVAL_OPTIONS,
  selectPollingInterval,
  setPollingInterval,
} from '@app/redux/slices/pollingIntervalSlice/pollingIntervalSlice.ts';

interface RefreshIntervalSelectProps {
  context: PollingContext;
}

// Maps a millisecond interval to the i18n key under shared.refreshInterval.*
const labelKeyFor = (ms: number): string => {
  if (ms === 0) return 'refreshInterval.off';
  if (ms < 60_000) return `refreshInterval.${ms / 1000}s`;
  if (ms < 3_600_000) return `refreshInterval.${ms / 60_000}m`;
  return `refreshInterval.${ms / 3_600_000}h`;
};

const RefreshIntervalSelect: FC<RefreshIntervalSelectProps> = ({ context }) => {
  const { t } = useTranslation('shared');
  const dispatch = useAppDispatch();
  const value = useAppSelector(selectPollingInterval(context));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPollingInterval({ context, intervalMs: Number(e.target.value) }));
  };

  return (
    <TextField
      select
      size="small"
      variant="standard"
      value={value}
      onChange={handleChange}
      aria-label={t('refreshInterval.label')}
      sx={{ minWidth: 64 }}>
      {POLLING_INTERVAL_OPTIONS.map((ms) => (
        <MenuItem key={ms} value={ms}>
          {t(labelKeyFor(ms))}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default RefreshIntervalSelect;
