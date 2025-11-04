import { ClusterFormValues } from '@features/cluster-secret-modal/model/types.ts';
import {
  getBaseClusterEnvs,
  getCloudProviderExtraVars,
  getLocalMachineEnvs,
  getLocalMachineExtraVars,
} from '@shared/lib/clusterValuesTransformFunctions.ts';
import { POSTGRES_PARAMETERS_FIELD_NAMES } from '@entities/cluster/expert-mode/postgres-parameters-block/model/const.ts';
import { KERNEL_PARAMETERS_FIELD_NAMES } from '@entities/cluster/expert-mode/kernel-parameters-block/model/const.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';

/**
 * Get value from modal form and convert to correct YAML format.
 * @param value - Form value.
 */
const convertModalParametersToYaml = (value: string) =>
  value.split(/[\n\r]/).map((item) => {
    const values = item.split(/[:=]/);
    return {
      option: values?.[0],
      value: values?.[1],
    };
  });

/**
 * Function converts passed form values into correct YAML "key:value" format with mapped keys.
 * @param values - Filled form values.
 */
export const mapFormValuesToYamlEditor = (values: ClusterFormValues) => {
  const transformedValues = getBaseClusterEnvs(values);
  const cloudProviderExtraVars = getCloudProviderExtraVars(values);
  const localMachineExtraVars = getLocalMachineExtraVars(values);
  const localMachineEnvs = getLocalMachineEnvs(values);

  return {
    ...transformedValues,
    ...(values[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code !== PROVIDERS.LOCAL
      ? { ...cloudProviderExtraVars }
      : { ...localMachineEnvs, ...localMachineExtraVars }),
    ...(values?.[POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS]
      ? {
          local_postgresql_parameters: convertModalParametersToYaml(
            values[POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS],
          ),
        }
      : {}),
    ...(values?.[KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS]
      ? {
          sysctl_set: true,
          sysctl_conf: convertModalParametersToYaml(values[KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS]),
        }
      : {}),
  };
};
