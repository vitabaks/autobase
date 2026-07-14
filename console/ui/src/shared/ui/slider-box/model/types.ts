import { ReactElement } from 'react';
import { SliderProps } from '@mui/material';
import { FieldError } from 'react-hook-form';

type SliderMark = Extract<NonNullable<SliderProps['marks']>, readonly unknown[]>[number];

export interface SliderBoxProps {
  amount: number;
  changeAmount: (amount: number) => void;
  icon?: ReactElement;
  unit?: string;
  min: number;
  max: number;
  marks?: SliderMark[];
  marksAmount?: number;
  marksAdditionalLabel?: string;
  step?: number | null;
  error?: FieldError;
  limitMin?: boolean;
  limitMax?: boolean;
  allowZero?: boolean;
  topRightElements?: ReactElement | null;
}

export type GenerateMarkType = (value: number, marksAdditionalLabel: string) => { label: string; value: number };

export type GenerateSliderMarksType = (
  min: number,
  max: number,
  amount: number,
  marksAdditionalLabel: string,
) => SliderMark[];
