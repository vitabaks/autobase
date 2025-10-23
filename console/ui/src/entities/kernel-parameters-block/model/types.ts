import { KERNEL_PARAMETERS_FIELD_NAMES } from '@entities/kernel-parameters-block/model/const.ts';

export interface KernelParametersBlockValues {
  [KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS]?: string;
}
