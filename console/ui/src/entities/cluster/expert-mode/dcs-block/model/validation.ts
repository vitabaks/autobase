import * as yup from 'yup';
import { TFunction } from 'i18next';
import { DCS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/dcs-block/model/const.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { IS_EXPERT_MODE } from '@shared/model/constants.ts';

export const DcsBlockSchema = (t: TFunction) =>
  yup.object({
    [DCS_BLOCK_FIELD_NAMES.TYPE]: yup.string(),
    [DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_NEW_CLUSTER]: yup.boolean(),
    [DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_TO_DB_SERVERS]: yup.boolean(),
    [DCS_BLOCK_FIELD_NAMES.DATABASES]: yup.array(
      yup.object({
        [DCS_BLOCK_FIELD_NAMES.DATABASE_ADDRESS]: yup
          .mixed()
          .when(
            [CLUSTER_FORM_FIELD_NAMES.PROVIDER, DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_NEW_CLUSTER],
            ([provider, isDeployNewCluster]) =>
              provider?.code === PROVIDERS.LOCAL && IS_EXPERT_MODE && !isDeployNewCluster
                ? yup.string().required(t('requiredField', { ns: 'validation' }))
                : yup.mixed().optional(),
          ),
        [DCS_BLOCK_FIELD_NAMES.DATABASE_PORT]: yup
          .mixed()
          .when(
            [CLUSTER_FORM_FIELD_NAMES.PROVIDER, DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_NEW_CLUSTER],
            ([provider, isDeployNewCluster]) =>
              provider?.code === PROVIDERS.LOCAL && IS_EXPERT_MODE && !isDeployNewCluster
                ? yup
                    .string()
                    .required(t('requiredField', { ns: 'validation' }))
                    .test(
                      'should be only numbers',
                      t('onlyNumbers', { ns: 'validation' }),
                      (value) => !Number.isNaN(Number(value)),
                    )
                : yup.mixed().optional(),
          ),
      }),
    ),
  });
