const PEM_LABELS = new Set([
  'OPENSSH PRIVATE KEY',
  'PRIVATE KEY',
  'ENCRYPTED PRIVATE KEY',
  'RSA PRIVATE KEY',
  'EC PRIVATE KEY',
  'DSA PRIVATE KEY',
]);

const OPENSSH_CIPHERS = new Set([
  'none',
  '3des-cbc',
  'aes128-cbc',
  'aes192-cbc',
  'aes256-cbc',
  'aes128-ctr',
  'aes192-ctr',
  'aes256-ctr',
  'aes128-gcm@openssh.com',
  'aes256-gcm@openssh.com',
  'chacha20-poly1305@openssh.com',
]);

// PKCS#8 algorithms that OpenSSH can load from a generic PRIVATE KEY envelope.
const SSH_PKCS8_ALGORITHM_OIDS = new Set([
  '2a864886f70d010101', // rsaEncryption
  '2a8648ce380401', // id-dsa
  '2a8648ce3d0201', // id-ecPublicKey
]);

const textDecoder = new TextDecoder();

type BinaryPart = { value: Uint8Array; nextOffset: number };
type DerNode = { tag: number; valueOffset: number; endOffset: number; nextOffset: number };

const decodeBase64 = (value: string): Uint8Array | null => {
  if (!value || !/^[A-Za-z0-9+/]+={0,2}$/.test(value) || value.length % 4 === 1) {
    return null;
  }

  try {
    const decoded = atob(value.padEnd(Math.ceil(value.length / 4) * 4, '='));

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

const readSshString = (value: Uint8Array, offset: number): BinaryPart | null => {
  const length = readUint32(value, offset);

  if (length === null || offset + 4 + length > value.length) {
    return null;
  }

  return { value: value.slice(offset + 4, offset + 4 + length), nextOffset: offset + 4 + length };
};

const isValidOpenSshKey = (value: Uint8Array): boolean => {
  const magic = new TextEncoder().encode('openssh-key-v1\0');

  if (value.length < magic.length || !magic.every((byte, index) => value[index] === byte)) {
    return false;
  }

  let offset = magic.length;
  const cipher = readSshString(value, offset);
  const kdf = cipher && readSshString(value, cipher.nextOffset);
  const kdfOptions = kdf && readSshString(value, kdf.nextOffset);

  if (!cipher || !kdf || !kdfOptions) {
    return false;
  }

  const cipherName = textDecoder.decode(cipher.value);
  const kdfName = textDecoder.decode(kdf.value);

  if (
    !OPENSSH_CIPHERS.has(cipherName) ||
    (cipherName === 'none' && (kdfName !== 'none' || kdfOptions.value.length !== 0)) ||
    (cipherName !== 'none' && (kdfName !== 'bcrypt' || kdfOptions.value.length === 0))
  ) {
    return false;
  }

  offset = kdfOptions.nextOffset;
  const keyCount = readUint32(value, offset);

  if (!keyCount || keyCount > 64) {
    return false;
  }

  offset += 4;
  for (let index = 0; index < keyCount; index += 1) {
    const publicKey = readSshString(value, offset);

    if (!publicKey?.value.length) {
      return false;
    }
    offset = publicKey.nextOffset;
  }

  const privateSection = readSshString(value, offset);

  if (!privateSection?.value.length || privateSection.nextOffset !== value.length) {
    return false;
  }

  if (cipherName !== 'none') {
    return true;
  }

  const firstCheck = readUint32(privateSection.value, 0);
  const secondCheck = readUint32(privateSection.value, 4);

  return firstCheck !== null && firstCheck === secondCheck;
};

const readDerNode = (value: Uint8Array, offset: number): DerNode | null => {
  if (offset + 2 > value.length) {
    return null;
  }

  const tag = value[offset];
  const firstLengthByte = value[offset + 1];
  let length = firstLengthByte;
  let valueOffset = offset + 2;

  if ((firstLengthByte & 0x80) !== 0) {
    const lengthBytes = firstLengthByte & 0x7f;

    if (lengthBytes === 0 || lengthBytes > 4 || valueOffset + lengthBytes > value.length) {
      return null;
    }

    length = 0;
    for (let index = 0; index < lengthBytes; index += 1) {
      length = length * 256 + value[valueOffset + index];
    }
    valueOffset += lengthBytes;
  }

  const endOffset = valueOffset + length;

  return endOffset <= value.length ? { tag, valueOffset, endOffset, nextOffset: endOffset } : null;
};

const readDerChildren = (value: Uint8Array, parent: DerNode): DerNode[] | null => {
  const children: DerNode[] = [];
  let offset = parent.valueOffset;

  while (offset < parent.endOffset) {
    const child = readDerNode(value, offset);

    if (!child || child.nextOffset > parent.endOffset) {
      return null;
    }
    children.push(child);
    offset = child.nextOffset;
  }

  return offset === parent.endOffset ? children : null;
};

const isDerInteger = (value: Uint8Array, node: DerNode, allowedValues?: number[]): boolean =>
  node.tag === 0x02 &&
  node.endOffset > node.valueOffset &&
  (!allowedValues ||
    (node.endOffset === node.valueOffset + 1 && allowedValues.includes(value[node.valueOffset])));

const derNodeHex = (value: Uint8Array, node: DerNode): string =>
  Array.from(value.slice(node.valueOffset, node.endOffset), (byte) => byte.toString(16).padStart(2, '0')).join('');

const isValidDerKey = (label: string, value: Uint8Array): boolean => {
  const root = readDerNode(value, 0);

  if (!root || root.tag !== 0x30 || root.nextOffset !== value.length) {
    return false;
  }

  const children = readDerChildren(value, root);

  if (!children) {
    return false;
  }

  if (label === 'RSA PRIVATE KEY') {
    return children.length >= 9 && isDerInteger(value, children[0], [0, 1]) && children.every((node) => isDerInteger(value, node));
  }

  if (label === 'DSA PRIVATE KEY') {
    return children.length === 6 && isDerInteger(value, children[0], [0]) && children.every((node) => isDerInteger(value, node));
  }

  if (label === 'EC PRIVATE KEY') {
    return (
      children.length >= 2 &&
      isDerInteger(value, children[0], [1]) &&
      children[1].tag === 0x04 &&
      children[1].endOffset > children[1].valueOffset &&
      children.slice(2).every((node) => node.tag === 0xa0 || node.tag === 0xa1)
    );
  }

  if (label === 'PRIVATE KEY') {
    const algorithm = children[1] && readDerChildren(value, children[1]);
    const algorithmOid = algorithm?.[0];

    return (
      children.length >= 3 &&
      isDerInteger(value, children[0], [0, 1]) &&
      children[1].tag === 0x30 &&
      Boolean(algorithmOid && algorithmOid.tag === 0x06) &&
      Boolean(algorithmOid && SSH_PKCS8_ALGORITHM_OIDS.has(derNodeHex(value, algorithmOid))) &&
      children[2].tag === 0x04 &&
      children[2].endOffset > children[2].valueOffset
    );
  }

  if (label === 'ENCRYPTED PRIVATE KEY') {
    const algorithm = children[0] && readDerChildren(value, children[0]);

    return (
      children.length === 2 &&
      children[0].tag === 0x30 &&
      Boolean(algorithm?.length && algorithm[0].tag === 0x06) &&
      children[1].tag === 0x04 &&
      children[1].endOffset > children[1].valueOffset
    );
  }

  return false;
};

export const isValidSshPrivateKey = (value: string): boolean => {
  const match = value
    .trim()
    .match(/^-----BEGIN ([A-Z0-9 ]+)-----\r?\n([A-Za-z0-9+/=\r\n]+?)\r?\n-----END \1-----$/);

  if (!match || !PEM_LABELS.has(match[1])) {
    return false;
  }

  const encodedKey = match[2].replace(/\r?\n/g, '');
  const decodedKey = decodeBase64(encodedKey);

  if (!decodedKey) {
    return false;
  }

  return match[1] === 'OPENSSH PRIVATE KEY'
    ? isValidOpenSshKey(decodedKey)
    : isValidDerKey(match[1], decodedKey);
};
