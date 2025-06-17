import { TFunction } from 'i18next';
import * as yup from 'yup';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import { AUTHENTICATION_METHODS } from '@shared/model/constants.ts';
import ipRegex from 'ip-regex';
import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';

const cloudFormSchema = (t: TFunction) =>
  yup.object({
    [CLUSTER_FORM_FIELD_NAMES.REGION]: yup
      .mixed()
      .when(CLUSTER_FORM_FIELD_NAMES.PROVIDER, ([provider], schema) =>
        provider?.code !== PROVIDERS.LOCAL ? yup.string().required() : schema.notRequired(),
      ),
    [CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG]: yup
      .mixed()
      .when(CLUSTER_FORM_FIELD_NAMES.PROVIDER, ([provider], schema) =>
        provider?.code !== PROVIDERS.LOCAL
          ? yup
              .object({
                code: yup.string(),
                location: yup.string(),
              })
              .required()
          : schema.notRequired(),
      ),
    [CLUSTER_FORM_FIELD_NAMES.INSTANCE_TYPE]: yup
      .mixed()
      .when(CLUSTER_FORM_FIELD_NAMES.PROVIDER, ([provider], schema) =>
        provider?.code !== PROVIDERS.LOCAL ? yup.string().required() : schema.notRequired(),
      ),
    [CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG]: yup
      .mixed()
      .when(CLUSTER_FORM_FIELD_NAMES.PROVIDER, ([provider], schema) =>
        provider?.code !== PROVIDERS.LOCAL
          ? yup
              .object({
                code: yup.string(),
                cpu: yup.number(),
                shared_cpu: yup.boolean(),
                currency: yup.string(),
                price_hourly: yup.number(),
                price_monthly: yup.number(),
                ram: yup.number(),
              })
              .required()
          : schema.notRequired(),
      ),
    [CLUSTER_FORM_FIELD_NAMES.INSTANCES_AMOUNT]: yup
      .mixed()
      .when(CLUSTER_FORM_FIELD_NAMES.PROVIDER, ([provider], schema) =>
        provider?.code !== PROVIDERS.LOCAL ? yup.number().required() : schema.notRequired(),
      ),
    [CLUSTER_FORM_FIELD_NAMES.STORAGE_AMOUNT]: yup
      .mixed()
      .when(CLUSTER_FORM_FIELD_NAMES.PROVIDER, ([provider], schema) =>
        provider?.code !== PROVIDERS.LOCAL ? yup.number().required() : schema.notRequired(),
      ),
    [CLUSTER_FORM_FIELD_NAMES.SSH_PUBLIC_KEY]: yup
      .mixed()
      .when(CLUSTER_FORM_FIELD_NAMES.PROVIDER, ([provider], schema) =>
        provider?.code !== PROVIDERS.LOCAL
          ? yup.string().required(t('requiredField', { ns: 'validation' }))
          : schema.notRequired(),
      ),
  });

export const localFormSchema = (t: TFunction) =>
  yup.object({
    [CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS]: yup
      .mixed()
      .when(CLUSTER_FORM_FIELD_NAMES.PROVIDER, ([provider], schema) =>
        provider?.code === PROVIDERS.LOCAL
          ? yup.array(
              yup.object({
                [CLUSTER_FORM_FIELD_NAMES.HOSTNAME]: yup.string().required(t('requiredField', { ns: 'validation' })),
                [CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]: yup
                  .string()
                  .required(t('requiredField', { ns: 'validation' }))
                  .test('should be a correct IP', t('shouldBeACorrectV4Ip', { ns: 'validation' }), (value) =>
                    ipRegex.v4({ exact: true }).test(value),
                  ),
                [CLUSTER_FORM_FIELD_NAMES.LOCATION]: yup.string(),
              }),
            )
          : schema.notRequired(),
      ),
    [CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD]: yup
      .mixed()
      .when(CLUSTER_FORM_FIELD_NAMES.PROVIDER, ([provider], schema) =>
        provider?.code === PROVIDERS.LOCAL ? yup.string().required() : schema.notRequired(),
      ),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SSH_PRIVATE_KEY]: yup
      .mixed()
      .when(
        [CLUSTER_FORM_FIELD_NAMES.PROVIDER, CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD],
        ([provider, authenticationMethod], schema) =>
          provider?.code === PROVIDERS.LOCAL && authenticationMethod === AUTHENTICATION_METHODS.SSH
            ? yup
                .mixed()
                .when(CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET, ([isUseDefinedSecret], schema) =>
                  !isUseDefinedSecret
                    ? yup.string().required(t('requiredField', { ns: 'validation' }))
                    : schema.notRequired(),
                )
            : schema.notRequired(),
      ),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME]: yup
      .mixed()
      .when(
        [CLUSTER_FORM_FIELD_NAMES.PROVIDER, CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD],
        ([provider, authenticationMethod], schema) =>
          provider?.code === PROVIDERS.LOCAL && authenticationMethod === AUTHENTICATION_METHODS.PASSWORD
            ? yup
                .mixed()
                .when(CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET, ([isUseDefinedSecret], schema) =>
                  !isUseDefinedSecret
                    ? yup.string().required(t('requiredField', { ns: 'validation' }))
                    : schema.notRequired(),
                )
            : schema.notRequired(),
      ),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.PASSWORD]: yup
      .mixed()
      .when(
        [CLUSTER_FORM_FIELD_NAMES.PROVIDER, CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD],
        ([provider, authenticationMethod], schema) =>
          provider?.code === PROVIDERS.LOCAL && authenticationMethod === AUTHENTICATION_METHODS.PASSWORD
            ? yup
                .mixed()
                .when(CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET, ([isUseDefinedSecret], schema) =>
                  !isUseDefinedSecret
                    ? yup.string().required(t('requiredField', { ns: 'validation' }))
                    : schema.notRequired(),
                )
            : schema.notRequired(),
      ),
    [CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_IS_SAVE_TO_CONSOLE]: yup
      .mixed()
      .when(
        [CLUSTER_FORM_FIELD_NAMES.PROVIDER, CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET],
        ([provider, isUseDefinedSecret], schema) =>
          provider?.code === PROVIDERS.LOCAL && !isUseDefinedSecret ? yup.boolean() : schema.notRequired(),
      ),
    [CLUSTER_FORM_FIELD_NAMES.SECRET_KEY_NAME]: yup
      .mixed()
      .when(
        [CLUSTER_FORM_FIELD_NAMES.PROVIDER, CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_IS_SAVE_TO_CONSOLE],
        ([provider, isSaveToConsole], schema) =>
          provider?.code === PROVIDERS.LOCAL && isSaveToConsole
            ? yup.string().required(t('requiredField', { ns: 'validation' }))
            : schema.notRequired(),
      ),
    [CLUSTER_FORM_FIELD_NAMES.CLUSTER_VIP_ADDRESS]: yup
      .mixed()
      .when(CLUSTER_FORM_FIELD_NAMES.PROVIDER, ([provider], schema) =>
        provider?.code === PROVIDERS.LOCAL
          ? yup
              .string()
              .test(
                'should be a correct VIP address',
                t('shouldBeACorrectV4Ip', { ns: 'validation' }),
                (value) => !value || ipRegex.v4({ exact: true }).test(value),
              )
          : schema.notRequired(),
      ),
    [CLUSTER_FORM_FIELD_NAMES.IS_HAPROXY_LOAD_BALANCER]: yup
      .mixed()
      .when(CLUSTER_FORM_FIELD_NAMES.PROVIDER, ([provider], schema) =>
        provider?.code === PROVIDERS.LOCAL ? yup.boolean() : schema.notRequired(),
      ),
    [CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET]: yup
      .mixed()
      .when([CLUSTER_FORM_FIELD_NAMES.PROVIDER], ([provider], schema) =>
        provider?.code === PROVIDERS.LOCAL ? yup.boolean().optional() : schema.notRequired(),
      ),
    [CLUSTER_FORM_FIELD_NAMES.SECRET_ID]: yup
      .mixed()
      .when(
        [CLUSTER_FORM_FIELD_NAMES.PROVIDER, CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET],
        ([provider, isUseDefinedSecret], schema) =>
          provider?.code === PROVIDERS.LOCAL && isUseDefinedSecret
            ? yup.string().required(t('requiredField', { ns: 'validation' }))
            : schema.notRequired(),
      ),
  });

export const ClusterFormSchema = (t: TFunction) =>
  yup.object().shape({
    [CLUSTER_FORM_FIELD_NAMES.PROVIDER]: yup.object().required(t('providerRequired')),
    [CLUSTER_FORM_FIELD_NAMES.ENVIRONMENT_ID]: yup.number().required(t('environmentRequired')),
    [CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME]: yup
      .string()
      .required(t('clusterNameRequired'))
      .test('clusters should have proper naming', 
        t('clusterShouldHaveProperNaming', { ns: 'validation' }), 
        (value) => Boolean(value?.match(/^[a-z0-9][a-z0-9-]{0,23}$/g))
      ),
    [CLUSTER_FORM_FIELD_NAMES.DESCRIPTION]: yup.string(),
    [CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION]: yup.number().required(t('postgresVersionRequired')),
    [CLUSTER_FORM_FIELD_NAMES.EXISTING_CLUSTER]: yup.boolean().default(false),
    [CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS]: yup.array().when(
      [CLUSTER_FORM_FIELD_NAMES.PROVIDER, CLUSTER_FORM_FIELD_NAMES.EXISTING_CLUSTER],
      ([provider, existingCluster], schema) => {
        if (provider?.code === PROVIDERS.LOCAL) {
          if (existingCluster) {
            return schema
              .of(
                yup.object().shape({
                  [CLUSTER_FORM_FIELD_NAMES.HOSTNAME]: yup.string().required(t('hostnameRequired')),
                  [CLUSTER_FORM_FIELD_NAMES.IP_ADDRESS]: yup
                    .string()
                    .required(t('ipAddressRequired'))
                    .matches(
                      /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
                      t('invalidIpAddress')
                    ),
                  [CLUSTER_FORM_FIELD_NAMES.LOCATION]: yup.string(),
                })
              )
              .min(1, t('atLeastOneServerRequired'));
          }
          return schema;
        }
        return schema;
      }
    ),
  })
    .concat(cloudFormSchema(t))
    .concat(localFormSchema(t));
