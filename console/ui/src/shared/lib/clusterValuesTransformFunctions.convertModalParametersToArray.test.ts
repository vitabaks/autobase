// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { convertModalParametersToArray } from '@shared/lib/clusterValuesTransformFunctions.ts';

describe('convertModalParametersToArray', () => {
  it('keeps colons in value for equal-separated parameters', () => {
    expect(convertModalParametersToArray('AWS_ENDPOINT=http://YOUR_MINIO_ADDRESS:9000')).toEqual([
      {
        option: 'AWS_ENDPOINT',
        value: 'http://YOUR_MINIO_ADDRESS:9000',
      },
    ]);
  });

  it('keeps colons in value for colon-separated parameters', () => {
    expect(convertModalParametersToArray('AWS_ENDPOINT:http://YOUR_MINIO_ADDRESS:9000')).toEqual([
      {
        option: 'AWS_ENDPOINT',
        value: 'http://YOUR_MINIO_ADDRESS:9000',
      },
    ]);
  });

  it('returns empty value when delimiter is missing', () => {
    expect(convertModalParametersToArray('AWS_ENDPOINT')).toEqual([
      {
        option: 'AWS_ENDPOINT',
        value: '',
      },
    ]);
  });

  it('parses mixed separators and ignores empty lines', () => {
    expect(
      convertModalParametersToArray(
        'AWS_ENDPOINT=http://YOUR_MINIO_ADDRESS:9000\r\nWALG_S3_PREFIX:s3://bucket/path\r\n',
      ),
    ).toEqual([
      {
        option: 'AWS_ENDPOINT',
        value: 'http://YOUR_MINIO_ADDRESS:9000',
      },
      {
        option: 'WALG_S3_PREFIX',
        value: 's3://bucket/path',
      },
    ]);
  });
});
