import * as yup from 'yup';
import { TFunction } from 'i18next';
import { LOAD_BALANCERS_FIELD_NAMES } from '@entities/cluster/load-balancers-block/model/const.ts';
import ipRegex from 'ip-regex';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import { IS_EXPERT_MODE } from '@shared/model/constants.ts';

export const LoadBalancerBlockSchema = (t: TFunction) =>
  yup.object({
    [LOAD_BALANCERS_FIELD_NAMES.IS_HAPROXY_ENABLED]: yup.boolean(),
    [LOAD_BALANCERS_FIELD_NAMES.IS_DEPLOY_TO_DATABASE_SERVERS]: yup.boolean().optional(),
    [LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES]: yup
      .mixed()
      .when(
        [
          CLUSTER_FORM_FIELD_NAMES.PROVIDER,
          LOAD_BALANCERS_FIELD_NAMES.IS_HAPROXY_ENABLED,
          LOAD_BALANCERS_FIELD_NAMES.IS_DEPLOY_TO_DATABASE_SERVERS,
        ],
        ([provider, isHaproxyEnabled, isDeployToDbServers], schema) =>
          IS_EXPERT_MODE && provider?.code === PROVIDERS.LOCAL && isHaproxyEnabled && !isDeployToDbServers
            ? yup.array(
                yup.object({
                  [LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES_HOSTNAME]: yup
                    .string()
                    .required(t('requiredField', { ns: 'validation' })),
                  [LOAD_BALANCERS_FIELD_NAMES.LOAD_BALANCER_DATABASES_IP_ADDRESS]: yup
                    .string()
                    .required(t('requiredField', { ns: 'validation' }))
                    .test('should be a correct IP', t('shouldBeACorrectV4Ip', { ns: 'validation' }), (value) =>
                      ipRegex.v4({ exact: true }).test(value),
                    ),
                }),
              )
            : schema.notRequired(),
      ),
  });
