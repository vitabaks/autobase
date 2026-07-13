import { describe, expect, it } from 'vitest';
import { isValidSshPublicKeyList } from './sshPublicKeyValidation';

const ED25519_KEY =
  'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKLrH3fWU5tqdyCqADmTz7Auq3rggkI46hTbya3JWWdR developer@example.com';
const RSA_KEY =
  'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDud746JrldE09b1DUcG7rJCV6+1/BWn5Fk5QrzxVxEDug2f4PJn+mtjwnrrXNLhyckIf93MBjsBGRpXWBYFY0OY+V5a17LM4ZOXmA5qFIknOqrpizKnQXM2SvbiumFcVcmtV20K5QdQVGEKzCsVGM9OxTQmgF5Ttp0Ht+h7Wz45CU8eX5mClbBO9b0XLmr4WBFCz3W8z43dtOrsHVbX/i8CsQi2S5ZaPn3nhNdhPZXVc94vtkNxI2TPB+RHYxgm1CC6WNJFoSYUb78aK/fnPOqnIQAB1yW+tblH3kkNnoSID3Zc4HTAHguogMT1WlVswEv3a7GnWe4+aXTxLvE1N6z';

const createOpenSshBlob = (keyType: string): string => {
  const bytes = new TextEncoder().encode(keyType);
  const blob = new Uint8Array(4 + bytes.length + 1);
  new DataView(blob.buffer).setUint32(0, bytes.length);
  blob.set(bytes, 4);
  blob[blob.length - 1] = 1;

  return btoa(String.fromCharCode(...blob));
};

describe('isValidSshPublicKeyList', () => {
  it('accepts valid OpenSSH public keys, including a comment and multiple lines', () => {
    expect(isValidSshPublicKeyList(`${ED25519_KEY}\n${RSA_KEY}\n`)).toBe(true);
  });

  it('rejects arbitrary text and a malformed key blob', () => {
    expect(isValidSshPublicKeyList('hjvkhjvkgvkjv')).toBe(false);
    expect(isValidSshPublicKeyList('ssh-ed25519 AAAA developer@example.com')).toBe(false);
  });

  it('rejects a key whose declared type differs from the encoded key type', () => {
    expect(isValidSshPublicKeyList(ED25519_KEY.replace('ssh-ed25519', 'ssh-rsa'))).toBe(false);
  });

  it('accepts the certificate and extended key types supported by ansible.posix.authorized_key', () => {
    for (const keyType of [
      'ssh-ed25519-cert-v01@openssh.com',
      'ssh-xmss@openssh.com',
      'webauthn-sk-ecdsa-sha2-nistp256@openssh.com',
    ]) {
      expect(isValidSshPublicKeyList(`${keyType} ${createOpenSshBlob(keyType)}`)).toBe(true);
    }
  });
});
