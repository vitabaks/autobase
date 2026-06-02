import { startOfDay } from 'date-fns/startOfDay';
import { subDays } from 'date-fns/subDays';
import { subMonths } from 'date-fns/subMonths';
import { subYears } from 'date-fns/subYears';
import { TFunction } from 'i18next';
import { DATE_RANGE_VALUES } from '@features/operations-table-buttons/model/constants.ts';

export const formatOperationsDate = (date: Date) => startOfDay(date).toISOString();

export const getOperationsTimeNameValue = (name: string) => {
  let value = '';

  switch (name) {
    case DATE_RANGE_VALUES.LAST_DAY:
      value = formatOperationsDate(subDays(new Date(), 1));
      break;
    case DATE_RANGE_VALUES.LAST_WEEK:
      value = formatOperationsDate(subDays(new Date(), 7));
      break;
    case DATE_RANGE_VALUES.LAST_MONTH:
      value = formatOperationsDate(subMonths(new Date(), 1));
      break;
    case DATE_RANGE_VALUES.LAST_THREE_MONTHS:
      value = formatOperationsDate(subMonths(new Date(), 3));
      break;
    case DATE_RANGE_VALUES.LAST_SIX_MONTHS:
      value = formatOperationsDate(subMonths(new Date(), 6));
      break;
    case DATE_RANGE_VALUES.LAST_YEAR:
      value = formatOperationsDate(subYears(new Date(), 1));
      break;
  }
  return { name, value };
};

export const getOperationsDateRangeVariants = (t: TFunction) => [
  {
    label: t('lastDay', { ns: 'operations' }),
    value: DATE_RANGE_VALUES.LAST_DAY,
  },
  {
    label: t('lastWeek', { ns: 'operations' }),
    value: DATE_RANGE_VALUES.LAST_WEEK,
  },
  {
    label: t('lastMonth', { ns: 'operations' }),
    value: DATE_RANGE_VALUES.LAST_MONTH,
  },
  {
    label: t('lastThreeMonths', { ns: 'operations' }),
    value: DATE_RANGE_VALUES.LAST_THREE_MONTHS,
  },
  {
    label: t('lastSixMonths', { ns: 'operations' }),
    value: DATE_RANGE_VALUES.LAST_SIX_MONTHS,
  },
  {
    label: t('lastYear', { ns: 'operations' }),
    value: DATE_RANGE_VALUES.LAST_YEAR,
  },
];
