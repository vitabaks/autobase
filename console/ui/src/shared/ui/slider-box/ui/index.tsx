import { FC } from 'react';
import { Box, Slider, TextField, Typography, useTheme } from '@mui/material';
import { SliderBoxProps } from '@shared/ui/slider-box/model/types.ts';

import { generateSliderMarks } from '@shared/ui/slider-box/lib/functions.ts';

const ClusterSliderBox: FC<SliderBoxProps> = ({
  amount,
  changeAmount,
  unit,
  icon,
  min = 1,
  max,
  marks,
  marksAmount,
  marksAdditionalLabel = '',
  step,
  error,
  limitMin = true,
  limitMax,
}) => {
  const theme = useTheme();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const num = Number(value);
      changeAmount(num < (min ?? 0) && limitMin ? min : num > (max ?? Infinity) && limitMax ? max : num);
    }
  };

  return (
    <Box display="flex" border={`1px solid ${theme.palette.divider}`} height="100px" borderRadius="8px" overflow="hidden">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRight={`1px solid ${theme.palette.divider}`}
        width="200px"
        height="100px"
        padding="8px"
        boxSizing="border-box"
        gap="8px">
        {icon}
        <TextField
          required
          value={amount}
          onChange={onChange}
          error={!!error}
          helperText={(error as any)?.message ?? ''}
          size="small"
          sx={{ width: '100px' }}
        />
        <Typography>{unit}</Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" width="100%" padding="32px">
        <Slider
          value={amount}
          onChange={changeAmount}
          step={step}
          valueLabelDisplay="auto"
          min={min}
          max={max}
          marks={(marks ?? generateSliderMarks(min ?? 1, max ?? 100, marksAmount ?? 0, marksAdditionalLabel)) as any}
        />
      </Box>
    </Box>
  );
};

export default ClusterSliderBox;
