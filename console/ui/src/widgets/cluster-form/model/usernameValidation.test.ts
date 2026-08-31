import { describe, expect, it } from 'vitest';
import { LocalFormSchema } from '@widgets/cluster-form/model/validation.ts';
import { SECRET_MODAL_CONTENT_FORM_FIELD_NAMES } from '@entities/secret-form-block/model/constants.ts';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';
import { AUTHENTICATION_METHODS } from '@shared/model/constants.ts';

const t = ((key: string) => key) as never;
const usernameField = SECRET_MODAL_CONTENT_FORM_FIELD_NAMES.USERNAME;

const validateUsername = (authenticationMethod: string, isUseDefinedSecret: boolean) =>
  LocalFormSchema(t).validateAt(usernameField, {
    [CLUSTER_FORM_FIELD_NAMES.PROVIDER]: { code: PROVIDERS.LOCAL },
    [CLUSTER_FORM_FIELD_NAMES.AUTHENTICATION_METHOD]: authenticationMethod,
    [CLUSTER_FORM_FIELD_NAMES.IS_USE_DEFINED_SECRET]: isUseDefinedSecret,
    [usernameField]: '',
  });

describe('local cluster username validation', () => {
  it('requires a username for inline SSH authentication', async () => {
    await expect(validateUsername(AUTHENTICATION_METHODS.SSH, false)).rejects.toThrow('requiredField');
  });

  it('requires a username when an existing SSH secret is used', async () => {
    await expect(validateUsername(AUTHENTICATION_METHODS.SSH, true)).rejects.toThrow('requiredField');
  });

  it('requires a username for inline password authentication', async () => {
    await expect(validateUsername(AUTHENTICATION_METHODS.PASSWORD, false)).rejects.toThrow('requiredField');
  });

  it('uses the username stored in an existing password secret', async () => {
    await expect(validateUsername(AUTHENTICATION_METHODS.PASSWORD, true)).resolves.toBe('');
  });
});
