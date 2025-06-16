import { RequestClusterCreate } from '@shared/api/api/clusters.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDER_CODE_TO_ANSIBLE_USER_MAP } from '@features/cluster-secret-modal/model/constants.ts';
import { AUTHENTICATION_METHODS } from '@shared/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import { ClusterFormValues } from '@features/cluster-secret-modal/model/types.ts';

import {
  SECRET_MODAL_CONTENT_BODY_FORM_FIELDS,
  SECRET_MODAL_CONTENT_FORM_FIELD_NAMES,
} from '@entities/secret-form-block/model/constants.ts';

export const getCommonExtraVars = (values: ClusterFormValues) => ({
  postgresql_version: values[CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION],
  patroni_cluster_name: values[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME],
});

export const getCloudProviderExtraVars = (values: ClusterFormValues) => ({
  cloud_provider: values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code,
  server_type: values[CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG].code,
  server_location: values[CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG].code,
  server_count: values[CLUSTER_FORM_FIELD_NAMES.INSTANCES_AMOUNT],
  volume_size: values[CLUSTER_FORM_FIELD_NAMES.STORAGE_AMOUNT],
  ssh_public_keys: values[CLUSTER_FORM_FIELD_NAMES.SSH_PUBLIC_KEY].split('\n').map((key) => `'${key}'`),
  ansible_user: PROVIDER_CODE_TO_ANSIBLE_USER_MAP[values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code],
  ...getCommonExtraVars(values),
  ...values[CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG].cloud_image.image,
});

export const getLocalMachineExtraVars = (values: ClusterFormValues, secretId?: number) => ({
  ...(values[CLUSTER_FORM_FIELD_NAMES.CLUSTER_VIP_ADDRESS]
    ? { cluster_vip: values[CLUSTER_FORM_FIELD_NAMES.CLUSTER_VIP_ADDRESS] }
    : {}),
  ...(values[CLUSTER_FORM_FIELD_NAMES.IS_HAPROXY_LOAD_BALANCER] ? { with_haproxy_load_balancing: true } : {}),
  ...(!secretId &&
  !values[CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET] &&
  values[CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD] === AUTHENTICATION_METHODS.PASSWORD
    ? {
        ansible_user: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME],
        ansible_ssh_pass: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.PASSWORD],
      }
    : {}),
  ...getCommonExtraVars(values),
});

export const getLocalMachineEnvs = (values: ClusterFormValues, secretId?: number) => ({
  ...(values[CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD] === AUTHENTICATION_METHODS.SSH &&
  !values[CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET] &&
  !secretId
    ? {
        SSH_PRIVATE_KEY_CONTENT: btoa(values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SSH_PRIVATE_KEY]),
      }
    : {}),
  ANSIBLE_INVENTORY_JSON: btoa(
    JSON.stringify({
      all: {
        vars: {
          ansible_user: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME],
          ...(values[CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD] === AUTHENTICATION_METHODS.PASSWORD
            ? {
                ansible_ssh_pass: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME],
                ansible_sudo_pass: values[SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.PASSWORD],
              }
            : {}),
        },
        children: {
          balancers: {
            hosts: values[CLUSTER_FORM_FIELD_NAMES.IS_HAPROXY_LOAD_BALANCER]
              ? values[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS].reduce(
                  (acc, server) => ({
                    ...acc,
                    [server[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]]: {
                      ansible_host: server[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS],
                    },
                  }),
                  {},
                )
              : {},
          },
          consul_instances: {
            hosts: {},
          },
          etcd_cluster: {
            hosts: values[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS].reduce(
              (acc, server) => ({
                ...acc,
                [server[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]]: {
                  ansible_host: server[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS],
                },
              }),
              {},
            ),
          },
          master: {
            hosts: {
              [values[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS][0][CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]]: {
                hostname: values[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS][0][CLUSTER_FORM_FIELD_NAMES.HOSTNAME],
                ansible_host: values[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS][0][CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS],
                server_location:
                  values[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS]?.[0]?.[CLUSTER_FORM_FIELD_NAMES.LOCATION],
                postgresql_exists: values[CLUSTER_FORM_FIELD_NAMES.EXISTING_CLUSTER] ?? false,
              },
            },
          },
          ...(values[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS].length > 1
            ? {
                replica: {
                  hosts: values[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS].slice(1).reduce(
                    (acc, server) => ({
                      ...acc,
                      [server.ipAddress]: {
                        hostname: server?.[CLUSTER_FORM_FIELD_NAMES.HOSTNAME],
                        ansible_host: server?.[CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS],
                        server_location: server?.[CLUSTER_FORM_FIELD_NAMES.LOCATION],
                        postgresql_exists: values[CLUSTER_FORM_FIELD_NAMES.EXISTING_CLUSTER] ?? false,
                      },
                    }),
                    {},
                  ),
                },
              }
            : {}),
          postgres_cluster: {
            children: {
              master: {},
              replica: {},
            },
          },
        },
      },
    }),
  ),
});

const convertObjectToRequiredFormat = (object: Record<any, any>) => {
  return Object.entries(object).reduce((acc: string[], [key, value]) => [...acc, `${key}=${value}`], []);
};

export const mapFormValuesToRequestFields = ({
  values,
  secretId,
  projectId,
  envs,
}: {
  values: ClusterFormValues;
  secretId?: number;
  projectId: number;
  envs?: object;
}): RequestClusterCreate => ({
  project_id: projectId,
  name: values[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME],
  environment_id: values[CLUSTER_FORM_FIELD_NAMES.ENVIRONMENT_ID],
  description: values[CLUSTER_FORM_FIELD_NAMES.DESCRIPTION],
  ...(secretId ? { auth_info: { secret_id: secretId } } : {}),
  ...(values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code === PROVIDERS.LOCAL
    ? { envs: convertObjectToRequiredFormat(getLocalMachineEnvs(values, secretId)) }
    : envs && values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code !== PROVIDERS.LOCAL
      ? {
          envs: convertObjectToRequiredFormat(
            Object.fromEntries(Object.entries(envs).filter(([key]) => SECRET_MODAL_CONTENT_BODY_FORM_FIELDS?.[key])),
          ),
        }
      : {}),
  extra_vars: convertObjectToRequiredFormat(
    values[CLUSTER_FORM_FIELD_NAMES.PROVIDER].code === PROVIDERS.LOCAL
      ? getLocalMachineExtraVars(values, secretId)
      : getCloudProviderExtraVars(values),
  ),
  existing_cluster: values[CLUSTER_FORM_FIELD_NAMES.EXISTING_CLUSTER] ?? false,
});
