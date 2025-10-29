import * as yup from 'yup';
import { TFunction } from 'i18next';
import { LOAD_BALANCERS_FIELD_NAMES } from '@entities/cluster/load-balancers-block/model/const.ts';
import ipRegex from 'ip-regex';
import { IS_EXPERT_MODE } from '@shared/model/constants.ts';

export const LoadBalancerBlockSchema = (t: TFunction) =>
  yup.object({
    [LOAD_BALANCERS_FIELD_NAMES.IS_HAPROXY_ENABLED]: yup.boolean(),
    [LOAD_BALANCERS_FIELD_NAMES.IS_DEPLOY_TO_DATABASE_SERVERS]: yup.boolean(),
    [LOAD_BALANCERS_FIELD_NAMES.DATABASES]: yup.array(
      yup.object({
        [LOAD_BALANCERS_FIELD_NAMES.DATABASES_HOSTNAME]: yup
          .mixed()
          .when(LOAD_BALANCERS_FIELD_NAMES.IS_DEPLOY_TO_DATABASE_SERVERS, ([isDeployToDbServers]) =>
            !isDeployToDbServers && IS_EXPERT_MODE
              ? yup.string().required(t('requiredField', { ns: 'validation' }))
              : yup.mixed().optional(),
          ),
        [LOAD_BALANCERS_FIELD_NAMES.DATABASES_ADDRESS]: yup
          .mixed()
          .when(LOAD_BALANCERS_FIELD_NAMES.IS_DEPLOY_TO_DATABASE_SERVERS, ([isDeployToDbServers]) =>
            !isDeployToDbServers && IS_EXPERT_MODE
              ? yup
                  .string()
                  .required(t('requiredField', { ns: 'validation' }))
                  .test('should be a correct IP', t('shouldBeACorrectV4Ip', { ns: 'validation' }), (value) =>
                    ipRegex.v4({ exact: true }).test(value),
                  )
              : yup.mixed().optional(),
          ),
      }),
    ),
  });
