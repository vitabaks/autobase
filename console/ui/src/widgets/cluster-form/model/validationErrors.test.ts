import { describe, expect, it, vi } from 'vitest';
import { FieldErrors } from 'react-hook-form';
import { getClusterFormValidationErrors } from '@widgets/cluster-form/model/validationErrors.ts';

const t = vi.fn((key: string, options?: { number?: number }) =>
  options?.number ? `${key} ${options.number}` : key,
);

describe('getClusterFormValidationErrors', () => {
  it('returns readable labels for top-level fields', () => {
    const errors = {
      clusterName: { type: 'required', message: 'Required field' },
      postgresVersion: { type: 'required', message: 'Required field' },
    } as FieldErrors;

    expect(getClusterFormValidationErrors(errors, t)).toEqual([
      { path: 'clusterName', label: 'clusterName', message: 'Required field' },
      { path: 'postgresVersion', label: 'postgresVersion', message: 'Required field' },
    ]);
  });

  it('includes the item number for errors in repeatable blocks', () => {
    const errors = {
      databaseServers: [
        undefined,
        {
          databaseServerHostname: { type: 'required', message: 'Required field' },
          databaseServerIpAddress: { type: 'format', message: 'Enter a valid IP address' },
        },
      ],
      dcsDatabases: [{ dcsDatabasePort: { type: 'required', message: 'Required field' } }],
    } as FieldErrors;

    expect(getClusterFormValidationErrors(errors, t)).toEqual([
      {
        path: 'databaseServers.1.databaseServerHostname',
        label: 'databaseServerNumber 2 — hostname',
        message: 'Required field',
      },
      {
        path: 'databaseServers.1.databaseServerIpAddress',
        label: 'databaseServerNumber 2 — ipAddress',
        message: 'Enter a valid IP address',
      },
      {
        path: 'dcsDatabases.0.dcsDatabasePort',
        label: 'dcsServerNumber 1 — port',
        message: 'Required field',
      },
    ]);
  });
});
