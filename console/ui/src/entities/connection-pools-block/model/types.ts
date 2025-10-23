import { UseFieldArrayRemove } from 'react-hook-form';
import { CONNECTION_POOLS_BLOCK_FIELD_NAMES } from '@entities/connection-pools-block/model/const.ts';

export interface ConnectionPoolBlockProps {
  index: number;
  remove?: UseFieldArrayRemove;
}

export interface ConnectionPoolBlockValues {
  [CONNECTION_POOLS_BLOCK_FIELD_NAMES.IS_CONNECTION_POOLER_ENABLED]?: boolean;
  [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS]: [
    {
      [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_NAME]?: string;
      [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_SIZE]?: number;
      [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_MODE]?: string;
    },
  ];
}
