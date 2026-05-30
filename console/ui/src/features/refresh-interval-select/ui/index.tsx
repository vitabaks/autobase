import { FC, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
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

// Render as a Button + Menu (rather than a TextField/Select) so the trigger
// uses the same flat text-button styling as the adjacent Refresh button. Side
// by side they read as a single "refresh + interval" affordance — the Grafana
// shape requested in PR #1563 review.
const RefreshIntervalSelect: FC<RefreshIntervalSelectProps> = ({ context }) => {
  const { t } = useTranslation('shared');
  const dispatch = useAppDispatch();
  const value = useAppSelector(selectPollingInterval(context));
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handlePick = (ms: number) => () => {
    dispatch(setPollingInterval({ context, intervalMs: ms }));
    handleClose();
  };

  return (
    <>
      <Button
        variant="text"
        size="small"
        endIcon={<ArrowDropDownIcon fontSize="small" />}
        onClick={handleOpen}
        aria-label={t('refreshInterval.label')}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
        sx={{ minWidth: 56, paddingX: '8px' }}>
        {t(labelKeyFor(value))}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{ paper: { sx: { minWidth: 96 } } }}>
        {POLLING_INTERVAL_OPTIONS.map((ms) => (
          <MenuItem key={ms} selected={ms === value} onClick={handlePick(ms)} dense>
            {t(labelKeyFor(ms))}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default RefreshIntervalSelect;
