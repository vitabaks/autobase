export const DATABASES_BLOCK_FIELD_NAMES = Object.freeze({
  DATABASES: 'databasesBlock',
  NAMES: 'databasesBlockNames',
  DATABASE_NAME: 'databasesBlockDatabaseName',
  USER_NAME: 'databasesBlockUsername',
  USER_PASSWORD: 'databasesBlockUserPassword',
  ENCODING: 'databasesBlockEncoding',
  LOCALE: 'databasesBlockLocale',
  BLOCK_ID: 'databasesBlockId', // blockId is required to match database name and presence for extensions. Should not be passed to API call or YAML editor
});
