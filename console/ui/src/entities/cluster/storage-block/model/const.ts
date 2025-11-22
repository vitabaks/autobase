export const STORAGE_BLOCK_FIELDS = Object.freeze({
  STORAGE_AMOUNT: 'storageAmount',
  FILE_SYSTEM_TYPE: 'fileSystemType',
  VOLUME_TYPE: 'volumeType',
});

export const fileSystemTypeOptions = Object.freeze([
  { label: 'ext4', value: 'ext4' },
  {
    label: 'xfs',
    value: 'xfs',
  },
  { label: 'zfs', value: 'zfs' },
]);
