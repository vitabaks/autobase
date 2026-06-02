import { FC, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { OperationsTableButtonsProps } from '@features/operations-table-buttons/model/types.ts';
import RefreshGroup from '@features/refresh-group';
import {
  getOperationsDateRangeVariants,
  getOperationsTimeNameValue,
} from '@features/operations-table-buttons/lib/functions.ts';

const OperationsTableButtons: FC<OperationsTableButtonsProps> = ({ refetch, startDate, setStartDate }) => {
  const { t } = useTranslation('operations');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const rangeOptions = getOperationsDateRangeVariants(t);
  const selectedRangeLabel = rangeOptions.find((option) => option.value === startDate.name)?.label ?? startDate.name;

  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handlePick = (value: string) => () => {
    setStartDate(getOperationsTimeNameValue(value));
    handleClose();
  };

  return (
    <Stack direction="row" justifyContent="flex-end" alignItems="center" gap="8px">
      <Box
        sx={(theme) => ({
          display: 'inline-flex',
          alignItems: 'stretch',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          backgroundColor: theme.palette.action.hover,
          overflow: 'hidden',
        })}>
        <Button
          variant="text"
          size="small"
          startIcon={<AccessTimeIcon fontSize="small" />}
          endIcon={<ArrowDropDownIcon fontSize="small" />}
          onClick={handleOpen}
          aria-haspopup="menu"
          aria-expanded={Boolean(anchorEl)}
          sx={(theme) => ({
            minHeight: 32,
            minWidth: 0,
            paddingLeft: 1,
            paddingRight: 0.75,
            color: theme.palette.text.primary,
            textTransform: 'none',
            '& .MuiButton-startIcon': {
              marginLeft: 0,
              marginRight: 0.75,
            },
            '& .MuiButton-endIcon': {
              marginLeft: 0.5,
              marginRight: -0.25,
            },
            '&:hover': {
              backgroundColor: theme.palette.action.selected,
            },
          })}>
          {selectedRangeLabel}
        </Button>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{ paper: { sx: { minWidth: 150 } } }}>
        {rangeOptions.map((option) => (
          <MenuItem key={option.value} selected={option.value === startDate.name} onClick={handlePick(option.value)} dense>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
      <RefreshGroup context="operations" onRefresh={refetch} />
    </Stack>
  );
};

export default OperationsTableButtons;
