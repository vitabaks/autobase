import { ClusterFormValues } from '@features/cluster-secret-modal/model/types.ts';
import {
  getBaseClusterExtraVars,
  getCloudProviderExtraVars,
  getLocalMachineEnvs,
  getLocalMachineExtraVars,
} from '@shared/lib/clusterValuesTransformFunctions.ts';
import { POSTGRES_PARAMETERS_FIELD_NAMES } from '@entities/cluster/expert-mode/postgres-parameters-block/model/const.ts';
import { KERNEL_PARAMETERS_FIELD_NAMES } from '@entities/cluster/expert-mode/kernel-parameters-block/model/const.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import { BACKUP_METHODS, BACKUPS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/backups-block/model/const.ts';

/**
 * Get value from modal form (postgres or kernel params) and convert to correct YAML format.
 * @param value - Form value.
 */
const convertModalParametersToYaml = (value: string) =>
  value.split(/[\n\r]/).map((item) => {
    const values = item.split(/[:=]/);
    return {
      option: values?.[0].trim(), // due to splitting rule, values might have unnecessary whitespaces that needs to be removed
      value: values?.[1].trim(),
    };
  });

/**
 * Function converts passed form values into correct YAML "key:value" format with mapped keys.
 * @param values - Filled form values.
 */
export const mapFormValuesToYamlEditor = (values: ClusterFormValues) => {
  return {
    ...getBaseClusterExtraVars(values),
    ...(values[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code !== PROVIDERS.LOCAL
      ? { ...getCloudProviderExtraVars(values) }
      : { ...getLocalMachineEnvs(values), ...getLocalMachineExtraVars(values) }),
    ...(values?.[POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS]
      ? {
          local_postgresql_parameters: convertModalParametersToYaml(
            values[POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS],
          ),
        }
      : {}),
    ...(values?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG]
      ? values?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_METHOD] === BACKUP_METHODS.PG_BACK_REST
        ? {
            pgbackrest_conf: { global: convertModalParametersToYaml(values[BACKUPS_BLOCK_FIELD_NAMES.CONFIG]) },
          }
        : { wal_g_json: convertModalParametersToYaml(values?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG]) }
      : {}),
    ...(values?.[KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS]
      ? {
          sysctl_set: true,
          sysctl_conf: {
            postgres_cluster: convertModalParametersToYaml(values[KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS]),
          },
        }
      : {}),
  };
};
