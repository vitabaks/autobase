import { describe, expect, it } from 'vitest';
import { formatBytes } from './formatBytes.ts';

describe('formatBytes', () => {
  it.each([
    [undefined, ''],
    [null, ''],
    [Number.NaN, ''],
    [0, '0 B'],
    [0.5, '0.5 B'],
    [320, '320 B'],
    [1024, '1 KiB'],
    [1536, '1.5 KiB'],
    [1024 ** 2, '1 MiB'],
    [3.25 * 1024 ** 3, '3.25 GiB'],
  ])('formats %s as %s', (value, expected) => {
    expect(formatBytes(value)).toBe(expected);
  });
});
