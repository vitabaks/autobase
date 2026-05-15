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
});
