import { ReactElement } from 'react';
import { Mark } from '@mui/material/Slider/useSlider.types';

export interface SliderBoxProps {
  amount: number;
  changeAmount: (...event: any[]) => void;
  icon?: ReactElement;
  unit?: string;
  min: number;
  max: number;
  marks?: { label: unknown; value: unknown }[];
  marksAmount?: number;
  marksAdditionalLabel?: string;
  step?: number | null;
  error?: object;
  limitMin?: boolean;
  limitMax?: boolean;
  topRightElements?: ReactElement | null;
}

export type GenerateMarkType = (value: number, marksAdditionalLabel: string) => { label: string; value: number };

export type GenerateSliderMarksType = (
  min: number,
  max: number,
  amount: number,
  marksAdditionalLabel: string,
) => Mark[];
