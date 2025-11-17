import * as yup from 'yup';
import { TFunction } from 'i18next';
import { DCS_BLOCK_FIELD_NAMES, DCS_TYPES } from '@entities/cluster/expert-mode/dcs-block/model/const.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { IS_EXPERT_MODE } from '@shared/model/constants.ts';
import ipRegex from 'ip-regex';

export const DcsBlockSchema = (t: TFunction) =>
  yup.object({
    [DCS_BLOCK_FIELD_NAMES.TYPE]: yup.string(),
    [DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_NEW_CLUSTER]: yup.boolean(),
    [DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_TO_DB_SERVERS]: yup.boolean(),
    [DCS_BLOCK_FIELD_NAMES.DCS_DATABASES]: yup
      .mixed()
      .when(
        [
          CLUSTER_FORM_FIELD_NAMES.PROVIDER,
          DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_NEW_CLUSTER,
          DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_TO_DB_SERVERS,
          DCS_BLOCK_FIELD_NAMES.TYPE,
        ],
        ([provider, isDeployNewCluster, isDeployToDbServers, dcsType], schema) =>
          IS_EXPERT_MODE && provider?.code === PROVIDERS.LOCAL && (!isDeployNewCluster || !isDeployToDbServers)
            ? yup.array(
                yup.object({
                  [DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_IP_ADDRESS]: yup
                    .string()
                    .required(t('requiredField', { ns: 'validation' }))
                    .test('should be a correct IP', t('shouldBeACorrectV4Ip', { ns: 'validation' }), (value) =>
                      ipRegex.v4({ exact: true }).test(value),
                    ),
                  [DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_PORT]:
                    !isDeployNewCluster && dcsType === DCS_TYPES.ETCD
                      ? yup
                          .string()
                          .required(t('requiredField', { ns: 'validation' }))
                          .test(
                            'should be only numbers',
                            t('onlyNumbers', { ns: 'validation' }),
                            (value) => !Number.isNaN(Number(value)),
                          )
                      : yup.string().optional(),
                  [DCS_BLOCK_FIELD_NAMES.DCS_DATABASE_HOSTNAME]:
                    isDeployNewCluster && !isDeployToDbServers
                      ? yup.string().required(t('requiredField', { ns: 'validation' }))
                      : yup.string().optional(),
                }),
              )
            : schema.notRequired(),
      ),
  });
