import { TFunction } from 'i18next';
import * as yup from 'yup';
import { configValidationSchema } from '@shared/model/validation.ts';
import { KERNEL_PARAMETERS_FIELD_NAMES } from '@entities/cluster/expert-mode/kernel-parameters-block/model/const.ts';

export const KernelParametersBlockFormSchema = (t: TFunction) =>
  yup.object({
    [KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS]: configValidationSchema(t).optional(),
  });
