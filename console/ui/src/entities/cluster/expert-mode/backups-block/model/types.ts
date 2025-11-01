import { BACKUPS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/backups-block/model/const.ts';

export interface BackupsBlockValues {
  [BACKUPS_BLOCK_FIELD_NAMES.IS_BACKUPS_ENABLED]: boolean;
  [BACKUPS_BLOCK_FIELD_NAMES.BACKUP_METHOD]?: string;
  [BACKUPS_BLOCK_FIELD_NAMES.BACKUP_START_TIME]?: number;
  [BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION]?: number;
  [BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL]?: string;
}
