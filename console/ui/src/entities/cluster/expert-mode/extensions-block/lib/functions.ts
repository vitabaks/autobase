import { ResponseDatabaseExtension } from '@shared/api/api/other.ts';

export const filterValues = (searchValue: string, extensions: ResponseDatabaseExtension[]) =>
  searchValue ? extensions?.filter((extension) => extension?.name?.includes(searchValue)) : extensions;
