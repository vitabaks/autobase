export const CONNECTION_POOLS_BLOCK_FIELD_NAMES = Object.freeze({
  IS_CONNECTION_POOLER_ENABLED: 'isConnectionPoolerEnabled',
  POOLS: 'pools',
  POOL_NAME: 'poolName',
  POOL_SIZE: 'poolSize',
  POOL_MODE: 'poolMode',
});

export const POOL_MODES = Object.freeze([
  {
    option: 'transaction',
    tooltip: 'Server is released back to pool after transaction finishes.',
  },
  { option: 'session', tooltip: 'Server is released back to pool after client disconnects.' },
  {
    option: 'statement',
    tooltip:
      'Server is released back to pool after query finishes. Transactions spanning multiple statements are disallowed in this mode.',
  },
]);
