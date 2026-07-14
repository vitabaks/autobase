import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Box, Slider, SliderProps, TextField, Typography, useTheme } from '@mui/material';
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
  allowZero = false,
  topRightElements,
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(String(amount));
  const [sliderValue, setSliderValue] = useState(amount);

  useEffect(() => {
    setInputValue(String(amount));
    setSliderValue(amount);
  }, [amount]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      setInputValue(value);
      if (value) changeAmount(Number(value));
    }
  };

  const onBlur = () => {
    const num = Number(inputValue);
    const nextAmount =
      num === 0 && allowZero
        ? 0
        : !inputValue || (num < (min ?? 0) && limitMin)
          ? min
          : num > (max ?? Infinity) && limitMax
            ? max
            : num;
    setInputValue(String(nextAmount));
    changeAmount(nextAmount);
  };

  const handleSliderChange: NonNullable<SliderProps['onChange']> = (_event, value) => {
    if (allowZero) {
      setSliderValue(Number(value));
      return;
    }
    changeAmount(Number(value));
  };

  const handleSliderChangeCommitted: NonNullable<SliderProps['onChangeCommitted']> = (_event, value) => {
    if (allowZero) changeAmount(Number(value) < min ? 0 : Number(value));
  };

  const sliderMarks = marks ?? generateSliderMarks(min ?? 1, max ?? 100, marksAmount ?? 0, marksAdditionalLabel);

  return (
    <Box
      display="flex"
      border={`1px solid ${theme.palette.divider}`}
      height="100px"
      borderRadius="8px"
      overflow="hidden">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRight={`1px solid ${theme.palette.divider}`}
        minWidth="155px"
        height="100px"
        padding="8px"
        boxSizing="border-box"
        gap="8px">
        {icon}
        <TextField
          required
          value={inputValue}
          onChange={onChange}
          onBlur={onBlur}
          error={!!error}
          helperText={error?.message ?? ''}
          size="small"
          sx={{ width: '75px' }}
        />
        <Typography>{unit}</Typography>
      </Box>
      <Box
        display="flex"
        alignItems="flex-end"
        flexDirection="column"
        justifyContent="center"
        width="100%"
        padding="32px">
        {topRightElements ?? null}
        <Slider
          value={allowZero ? sliderValue : amount}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderChangeCommitted}
          step={allowZero ? 1 : step}
          valueLabelDisplay="auto"
          min={allowZero ? 0 : min}
          max={max}
          marks={sliderMarks}
        />
      </Box>
    </Box>
  );
};

export default ClusterSliderBox;
