import { TFunction } from 'i18next';
import * as yup from 'yup';
import { DATA_DISK_STORAGE_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/data-disk-storage-block/model/const.ts';

export const DataDiskStorageBlockFormSchema = (t: TFunction) =>
  yup.object({
    [DATA_DISK_STORAGE_BLOCK_FIELD_NAMES.SERVER_NETWORK]: yup.string(),
  });
