import * as yup from 'yup';
import { TFunction } from 'i18next';
import { PROVIDERS } from '@shared/config/constants.ts';

import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';
import { isValidSshPrivateKey } from '@shared/lib/sshPrivateKeyValidation.ts';

const requiredField = ({ valueToBeRequired, t }: { valueToBeRequired: string; t: TFunction }) =>
  yup
    .mixed()
    .when(SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_TYPE, ([secretType]) =>
      secretType === valueToBeRequired
        ? yup.string().required(t('requiredField', { ns: 'validation' }))
        : yup.mixed().optional(),
    );

export const AddSecretFormSchema = (t: TFunction) =>
  yup.object({
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_TYPE]: yup.string().required(),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_NAME]: yup
      .string()
      .required(t('requiredField', { ns: 'validation' })),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.AWS_ACCESS_KEY_ID]: requiredField({ valueToBeRequired: PROVIDERS.AWS, t }),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.AWS_SECRET_ACCESS_KEY]: requiredField({
      valueToBeRequired: PROVIDERS.AWS,
      t,
    }),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.GCP_SERVICE_ACCOUNT_CONTENTS]: requiredField({
      valueToBeRequired: PROVIDERS.GCP,
      t,
    }),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.AZURE_SUBSCRIPTION_ID]: requiredField({
      valueToBeRequired: PROVIDERS.AZURE,
      t,
    }),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.AZURE_CLIENT_ID]: requiredField({ valueToBeRequired: PROVIDERS.AZURE, t }),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.AZURE_SECRET]: requiredField({ valueToBeRequired: PROVIDERS.AZURE, t }),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.AZURE_TENANT]: requiredField({ valueToBeRequired: PROVIDERS.AZURE, t }),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.DO_API_TOKEN]: requiredField({
      valueToBeRequired: PROVIDERS.DIGITAL_OCEAN,
      t,
    }),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.HCLOUD_API_TOKEN]: requiredField({
      valueToBeRequired: PROVIDERS.HETZNER,
      t,
    }),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SSH_PRIVATE_KEY]: yup
      .mixed()
      .when(SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_TYPE, ([secretType]) =>
        secretType === 'ssh_key'
          ? yup
              .string()
              .required(t('requiredField', { ns: 'validation' }))
              .test(
                'is valid SSH private key',
                t('invalidSshPrivateKey', { ns: 'validation' }),
                (value) => !value || isValidSshPrivateKey(value),
              )
          : yup.mixed().optional(),
      ),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME]: requiredField({ valueToBeRequired: 'password', t }),
    [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.PASSWORD]: requiredField({ valueToBeRequired: 'password', t }),
  });
