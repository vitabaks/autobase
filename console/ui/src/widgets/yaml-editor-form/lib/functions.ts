import { ClusterFormValues } from '@features/cluster-secret-modal/model/types.ts';
import {
  getBaseClusterExtraVars,
  getCloudProviderExtraVars,
  getLocalMachineExtraVars,
} from '@shared/lib/clusterValuesTransformFunctions.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';

/**
 * Function converts passed form values into correct YAML "key:value" format with mapped keys.
 * @param values - Filled form values.
 */
export const mapFormValuesToYamlEditor = (values: ClusterFormValues) => ({
  ...getBaseClusterExtraVars(values),
  ...(values[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code !== PROVIDERS.LOCAL
    ? { ...getCloudProviderExtraVars(values) }
    : { ...getLocalMachineExtraVars(values) }),
});
