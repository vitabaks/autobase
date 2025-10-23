export const BACKUPS_BLOCK_FIELD_NAMES = Object.freeze({
  IS_BACKUPS_ENABLED: 'isBackupsEnabled',
  BACKUP_METHOD: 'backupMethod',
  BACKUP_START_TIME: 'backupStartTime',
  BACKUP_RETENTION: 'backupRetention',
  CONFIG: 'config',
  CONFIG_GLOBAL: 'configGlobal',
  CONFIG_STANZA: 'configStanza',
});

export const BACKUP_METHODS = Object.freeze({
  PG_BACK_REST: 'pgbackrest_install',
  WAL_G: 'wal_g_install',
});
