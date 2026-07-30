import { GenerateMarkType, GenerateSliderMarksType } from '@shared/ui/slider-box/model/types.ts';

const formatMarkLabel = (value: number, marksAdditionalLabel: string) => {
  if (marksAdditionalLabel === 'GB' && value >= 1000) {
    const tbValue = value / 1000;
    return `${Number.isInteger(tbValue) ? tbValue : tbValue.toFixed(1)} TB`;
  }

  return `${value} ${marksAdditionalLabel}`;
};

const generateMark: GenerateMarkType = (value, marksAdditionalLabel) => ({
  value,
  label: formatMarkLabel(value, marksAdditionalLabel),
});

const getMarkRoundingStep = (step: number) => {
  if (step <= 1) {
    return 1;
  }

  return 10 ** Math.floor(Math.log10(step));
};

const getNiceTbStep = (maxTb: number, amount: number) => {
  if (maxTb <= amount) {
    return 1;
  }

  const rawStep = maxTb / (amount - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalizedStep = rawStep / magnitude;

  if (normalizedStep <= 2) {
    return 2 * magnitude;
  }

  if (normalizedStep <= 5) {
    return 5 * magnitude;
  }

  return 10 * magnitude;
};

const generateTbSliderMarks: GenerateSliderMarksType = (min, max, amount, marksAdditionalLabel) => {
  const maxTb = max / 1000;
  const tbStep = getNiceTbStep(maxTb, amount);
  const marksArray = [generateMark(min, marksAdditionalLabel)];
  const firstTbMark = Math.ceil(min / 1000 / tbStep) * tbStep;

  for (let tbValue = firstTbMark; tbValue < maxTb; tbValue += tbStep) {
    const value = tbValue * 1000;

    if (value !== min) {
      marksArray.push(generateMark(value, marksAdditionalLabel));
    }
  }

  if (marksArray[marksArray.length - 1]?.value !== max) {
    marksArray.push(generateMark(max, marksAdditionalLabel));
  }

  return marksArray;
};

export const generateSliderMarks: GenerateSliderMarksType = (min, max, amount, marksAdditionalLabel) => {
  if (amount <= 1) {
    return [generateMark(min, marksAdditionalLabel)];
  }

  if (marksAdditionalLabel === 'GB' && max >= 1000) {
    return generateTbSliderMarks(min, max, amount, marksAdditionalLabel);
  }

  const step = (max - min) / (amount - 1);
  const roundingStep = getMarkRoundingStep(step);
  const marksArray = [generateMark(min, marksAdditionalLabel)];

  for (let i = 1; i < amount - 1; i += 1) {
    const value = min + step * i;
    marksArray.push(generateMark(Math.round(value / roundingStep) * roundingStep, marksAdditionalLabel));
  }

  return [...marksArray, generateMark(max, marksAdditionalLabel)];
};
