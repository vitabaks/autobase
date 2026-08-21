import { describe, expect, it } from 'vitest';
import { isValidSshPrivateKey } from './sshPrivateKeyValidation';

const OPENSSH_ED25519_KEY = `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACBTRRUtAmauQjO7I0OvniI2O9cmvZZoVjRqMJ2uh7MhFgAAAIjovJGI6LyR
iAAAAAtzc2gtZWQyNTUxOQAAACBTRRUtAmauQjO7I0OvniI2O9cmvZZoVjRqMJ2uh7MhFg
AAAEDCcL45+Xx6+8xCwB72fSl6cDhMWiq4+ddWh85WyHS9alNFFS0CZq5CM7sjQ6+eIjY7
1ya9lmhWNGowna6HsyEWAAAAAAECAwQF
-----END OPENSSH PRIVATE KEY-----`;

const PKCS8_EC_KEY = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgUMb1V/1Ix+pFTN0g
KQ+CA7LR8wtT4xlmBl/ySKS4GK2hRANCAAR/2V0JNDnlN4lvAsDiPexojB1MzTzZ
TUgrrHRa/fNsiLzI2XgU6Mcv+Q+G6wtFk9KLBN6NRznduNGqgPvHGCLX
-----END PRIVATE KEY-----`;

const EC_KEY = `-----BEGIN EC PRIVATE KEY-----
MHcCAQEEID3a8eX56IFqD3nJx6ls6t7WkK2tKty8DS2MzIfoN0oKoAoGCCqGSM49
AwEHoUQDQgAEVyV198NISNSaIZcHRir5oIMrEIHg1LK/Box9QUMW3crfXNcvewUK
L0MNZecKWKbWkMDCfOp1Vp8jnAIkORbjtw==
-----END EC PRIVATE KEY-----`;

describe('isValidSshPrivateKey', () => {
  it('accepts valid OpenSSH and PEM private key formats', () => {
    expect(isValidSshPrivateKey(OPENSSH_ED25519_KEY)).toBe(true);
    expect(isValidSshPrivateKey(PKCS8_EC_KEY)).toBe(true);
    expect(isValidSshPrivateKey(EC_KEY)).toBe(true);
  });

  it('accepts CRLF line endings and surrounding whitespace', () => {
    expect(isValidSshPrivateKey(`\n${OPENSSH_ED25519_KEY.replace(/\n/g, '\r\n')}\n`)).toBe(true);
  });

  it('rejects arbitrary text, a public key, and malformed base64', () => {
    expect(isValidSshPrivateKey('not a private key')).toBe(false);
    expect(isValidSshPrivateKey('ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMalformed')).toBe(false);
    expect(
      isValidSshPrivateKey(`-----BEGIN OPENSSH PRIVATE KEY-----
not_base64!
-----END OPENSSH PRIVATE KEY-----`),
    ).toBe(false);
  });

  it('rejects mismatched PEM boundaries and truncated key data', () => {
    expect(isValidSshPrivateKey(OPENSSH_ED25519_KEY.replace('END OPENSSH', 'END RSA'))).toBe(false);
    expect(isValidSshPrivateKey(OPENSSH_ED25519_KEY.replace('1ya9lmhWNGowna6HsyEWAAAAAAECAwQF', 'AAAA'))).toBe(false);
    expect(isValidSshPrivateKey(PKCS8_EC_KEY.replace('MIGHAgEA', 'MAECAQA='))).toBe(false);
  });
});
