const BYTE_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'] as const;

export const formatBytes = (bytes?: number | null): string => {
  if (bytes == null || !Number.isFinite(bytes)) {
    return '';
  }

  const absoluteBytes = Math.abs(bytes);
  const unitIndex =
    absoluteBytes === 0
      ? 0
      : Math.max(0, Math.min(Math.floor(Math.log(absoluteBytes) / Math.log(1024)), BYTE_UNITS.length - 1));
  const value = bytes / 1024 ** unitIndex;
  const formattedValue = Number(value.toFixed(2));

  return `${formattedValue} ${BYTE_UNITS[unitIndex]}`;
};
