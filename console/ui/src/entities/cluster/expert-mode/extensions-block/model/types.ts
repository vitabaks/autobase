import { EXTENSION_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/extensions-block/model/const.ts';
import { ResponseDatabaseExtension } from '@shared/api/api/other.ts';

export interface ExtensionSelectorProps {
  extension: ResponseDatabaseExtension;
}

export interface ExtensionBoxProps extends ExtensionSelectorProps {
  extensionIcons: Record<string, string>;
}

export interface ExtensionsSwiperProps extends Pick<ExtensionBoxProps, 'extensionIcons'> {
  isPending: boolean;
  filteredExtensions: ResponseDatabaseExtension[];
}

export interface ExtensionsBlockValues {
  [EXTENSION_BLOCK_FIELD_NAMES.EXTENSIONS]?: Record<string, { db: string[]; isThirdParty: boolean }>;
}
