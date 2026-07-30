// Keep this list aligned with ansible.posix.authorized_key's VALID_SSH2_KEY_TYPES.
const SSH_KEY_TYPES = new Set([
  'sk-ecdsa-sha2-nistp256@openssh.com',
  'sk-ecdsa-sha2-nistp256-cert-v01@openssh.com',
  'webauthn-sk-ecdsa-sha2-nistp256@openssh.com',
  'ecdsa-sha2-nistp256',
  'ecdsa-sha2-nistp256-cert-v01@openssh.com',
  'ecdsa-sha2-nistp384',
  'ecdsa-sha2-nistp384-cert-v01@openssh.com',
  'ecdsa-sha2-nistp521',
  'ecdsa-sha2-nistp521-cert-v01@openssh.com',
  'sk-ssh-ed25519@openssh.com',
  'sk-ssh-ed25519-cert-v01@openssh.com',
  'ssh-ed25519',
  'ssh-ed25519-cert-v01@openssh.com',
  'ssh-dss',
  'ssh-rsa',
  'ssh-xmss@openssh.com',
  'ssh-xmss-cert-v01@openssh.com',
  'rsa-sha2-256',
  'rsa-sha2-512',
  'ssh-rsa-cert-v01@openssh.com',
  'rsa-sha2-256-cert-v01@openssh.com',
  'rsa-sha2-512-cert-v01@openssh.com',
  'ssh-dss-cert-v01@openssh.com',
]);

const ECDSA_CURVES: Record<string, { name: string; pointLength: number }> = {
  'ecdsa-sha2-nistp256': { name: 'nistp256', pointLength: 65 },
  'ecdsa-sha2-nistp384': { name: 'nistp384', pointLength: 97 },
  'ecdsa-sha2-nistp521': { name: 'nistp521', pointLength: 133 },
};

const SK_ECDSA_CURVE = { name: 'nistp256', pointLength: 65 };
const RSA_SHA2_KEY_TYPES = new Set(['rsa-sha2-256', 'rsa-sha2-512']);

const textDecoder = new TextDecoder();

const decodeBase64 = (value: string): Uint8Array | null => {
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(value) || value.length % 4 === 1) {
    return null;
  }

  try {
    const paddedValue = value.padEnd(Math.ceil(value.length / 4) * 4, '=');
    const decoded = atob(paddedValue);

    return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
};

const readUint32 = (value: Uint8Array, offset: number): number | null => {
  if (offset + 4 > value.length) {
    return null;
  }

  return (value[offset] * 2 ** 24 + value[offset + 1] * 2 ** 16 + value[offset + 2] * 2 ** 8 + value[offset + 3]) >>> 0;
};

const readString = (value: Uint8Array, offset: number): { value: Uint8Array; nextOffset: number } | null => {
  const length = readUint32(value, offset);

  if (length === null || offset + 4 + length > value.length) {
    return null;
  }

  return { value: value.slice(offset + 4, offset + 4 + length), nextOffset: offset + 4 + length };
};

const readPositiveMpint = (value: Uint8Array, offset: number): number | null => {
  const mpint = readString(value, offset);

  if (!mpint?.value.length || mpint.value.every((byte) => byte === 0)) {
    return null;
  }

  return mpint.nextOffset;
};

const isValidPublicKeyBlob = (keyType: string, encodedKey: string): boolean => {
  const blob = decodeBase64(encodedKey);

  if (!blob) {
    return false;
  }

  const type = readString(blob, 0);

  const blobKeyType = type && textDecoder.decode(type.value);

  if (!type || (blobKeyType !== keyType && (!RSA_SHA2_KEY_TYPES.has(keyType) || blobKeyType !== 'ssh-rsa'))) {
    return false;
  }

  if (keyType === 'ssh-ed25519') {
    const publicKey = readString(blob, type.nextOffset);

    return Boolean(publicKey && publicKey.value.length === 32 && publicKey.nextOffset === blob.length);
  }

  if (keyType === 'sk-ssh-ed25519@openssh.com') {
    const publicKey = readString(blob, type.nextOffset);
    const application = publicKey && readString(blob, publicKey.nextOffset);

    return Boolean(
      publicKey && publicKey.value.length === 32 && application?.value.length && application.nextOffset === blob.length,
    );
  }

  if (keyType === 'ssh-rsa' || RSA_SHA2_KEY_TYPES.has(keyType)) {
    const exponentOffset = readPositiveMpint(blob, type.nextOffset);
    const modulusOffset = exponentOffset === null ? null : readPositiveMpint(blob, exponentOffset);

    return modulusOffset === blob.length;
  }

  if (keyType === 'ssh-dss') {
    let offset: number | null = type.nextOffset;

    for (let index = 0; index < 4 && offset !== null; index += 1) {
      offset = readPositiveMpint(blob, offset);
    }

    return offset === blob.length;
  }

  if (!ECDSA_CURVES[keyType] && keyType !== 'sk-ecdsa-sha2-nistp256@openssh.com') {
    // Certificates, XMSS and WebAuthn key formats are accepted by Ansible. Their
    // binary payloads vary, but all begin with the algorithm name parsed above.
    return type.nextOffset < blob.length;
  }

  const isSecurityKey = keyType === 'sk-ecdsa-sha2-nistp256@openssh.com';
  const curve = isSecurityKey ? SK_ECDSA_CURVE : ECDSA_CURVES[keyType];
  const curveName = readString(blob, type.nextOffset);
  const publicKey = curveName && readString(blob, curveName.nextOffset);
  const application = isSecurityKey && publicKey && readString(blob, publicKey.nextOffset);

  return Boolean(
    curve &&
    curveName &&
    textDecoder.decode(curveName.value) === curve.name &&
    publicKey &&
    publicKey.value.length === curve.pointLength &&
    publicKey.value[0] === 4 &&
    (isSecurityKey
      ? application && application.value.length && application.nextOffset === blob.length
      : publicKey.nextOffset === blob.length),
  );
};

const isValidSshPublicKeyLine = (line: string): boolean => {
  const [keyType, encodedKey] = line.trim().split(/\s+/, 3);

  return Boolean(keyType && encodedKey && SSH_KEY_TYPES.has(keyType) && isValidPublicKeyBlob(keyType, encodedKey));
};

export const isValidSshPublicKeyList = (value: string): boolean => {
  const keys = value.split(/\r?\n/).filter((line) => line.trim());

  return keys.length > 0 && keys.every(isValidSshPublicKeyLine);
};
