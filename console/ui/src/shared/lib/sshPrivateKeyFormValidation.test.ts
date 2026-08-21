import { describe, expect, it } from 'vitest';
import { AddSecretFormSchema } from '@features/add-secret/model/validation.ts';
import { LocalFormSchema } from '@widgets/cluster-form/model/validation.ts';
import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import { AUTHENTICATION_METHODS } from '@shared/model/constants.ts';

const t = ((key: string) => key) as never;
const privateKeyField = SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SSH_PRIVATE_KEY;

describe('SSH private key form validation', () => {
  it('validates private keys when an SSH secret is created', async () => {
    await expect(
      AddSecretFormSchema(t).validateAt(privateKeyField, {
        [SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.SECRET_TYPE]: AUTHENTICATION_METHODS.SSH,
        [privateKeyField]: 'not a private key',
      }),
    ).rejects.toThrow('invalidSshPrivateKey');
  });

  it('validates an inline private key when a local cluster is created', async () => {
    await expect(
      LocalFormSchema(t).validateAt(privateKeyField, {
        [CLUSTER_FORM_FIELD_NAMES.PROVIDER]: { code: PROVIDERS.LOCAL },
        [CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD]: AUTHENTICATION_METHODS.SSH,
        [CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET]: false,
        [privateKeyField]: 'not a private key',
      }),
    ).rejects.toThrow('invalidSshPrivateKey');
  });
});
