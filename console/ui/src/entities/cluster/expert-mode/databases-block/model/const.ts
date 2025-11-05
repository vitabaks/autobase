export const DATABASES_BLOCK_FIELD_NAMES = Object.freeze({
  DATABASES: 'databases',
  NAMES: 'names',
  DATABASE_NAME: 'databaseName',
  USER_NAME: 'username',
  USER_PASSWORD: 'userPassword',
  ENCODING: 'encoding',
  LOCALE: 'locale',
  BLOCK_ID: 'blockId', // blockId is required to match database name and presence for extensions. Should not be passed to API call or YAML editor
});
