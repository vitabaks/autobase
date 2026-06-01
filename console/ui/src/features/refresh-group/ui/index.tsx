import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { PollingContext } from '@app/redux/slices/pollingIntervalSlice/pollingIntervalSlice.ts';
import RefreshIntervalSelect from '@features/refresh-interval-select';

interface RefreshGroupProps {
  context: PollingContext;
  onRefresh: () => void;
}

// Grafana-style joined control: [ ↻ Refresh | 1m v ] — one button group
// with a shared filled background, a thin vertical divider between the two
// segments, and a single outer border. Keep the interval attached to Refresh,
// while the whole group remains the rightmost toolbar action.
const RefreshGroup: FC<RefreshGroupProps> = ({ context, onRefresh }) => {
  const { t } = useTranslation('shared');
  return (
    <Box
      sx={(theme) => ({
        display: 'inline-flex',
        alignItems: 'stretch',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        backgroundColor: theme.palette.action.hover,
        overflow: 'hidden',
        '& > *': {
          borderRadius: 0,
          minHeight: 32,
          color: theme.palette.text.primary,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: theme.palette.action.selected,
          },
        },
        '& > *:not(:last-child)': {
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      })}>
      <Button
        onClick={onRefresh}
        startIcon={<RefreshIcon fontSize="small" />}
        variant="text"
        size="small"
        sx={{ paddingX: 1.5 }}>
        {t('refresh')}
      </Button>
      <RefreshIntervalSelect context={context} />
    </Box>
  );
};

export default RefreshGroup;
