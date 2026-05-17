import { describe, expect, it } from 'vitest';
import { configValidationSchema } from '@shared/model/validation.ts';

describe('configValidationSchema', () => {
  const t = ((key: string) => key) as never;

  it('accepts values with colon for equal-separated format', () => {
    expect(configValidationSchema(t).isValidSync('AWS_ENDPOINT=http://YOUR_MINIO_ADDRESS:9000')).toBe(true);
  });

  it('accepts values with colon for colon-separated format', () => {
    expect(configValidationSchema(t).isValidSync('AWS_ENDPOINT:http://YOUR_MINIO_ADDRESS:9000')).toBe(true);
  });

  it('accepts mixed separators and a trailing newline', () => {
    expect(
      configValidationSchema(t).isValidSync(
        'AWS_ENDPOINT=http://YOUR_MINIO_ADDRESS:9000\nWALG_S3_PREFIX:s3://bucket/path\n',
      ),
    ).toBe(true);
  });

  it('rejects parameters without separator', () => {
    expect(configValidationSchema(t).isValidSync('AWS_ENDPOINT')).toBe(false);
  });
});
