import { TFunction } from 'i18next';
import RouterPaths from '@app/router/routerPathsConfig';
import ClustersIcon from '@assets/clustersIcon.svg?react';
import OperationsIcon from '@assets/operationsIcon.svg?react';
import SettingsIcon from '@assets/settingsIcon.svg?react';
import DbdeskIcon from '@assets/dbdeskIcon.svg?react';
import GithubIcon from '@assets/githubIcon.svg?react';
import DocumentationIcon from '@assets/docsIcon.svg?react';
import SupportIcon from '@assets/supportIcon.svg?react';
import SponsorIcon from '@assets/sponsorIcon.svg?react';
import { DBDESK_URL } from '@shared/config/constants.ts';

export const sidebarData = (t: TFunction) => {
  const items = [
    {
      icon: ClustersIcon,
      label: t('clusters', { ns: 'clusters' }),
      path: RouterPaths.clusters.absolutePath,
    },
    {
      icon: OperationsIcon,
      label: t('operations', { ns: 'operations' }),
      path: RouterPaths.operations.absolutePath,
    },
    {
      icon: SettingsIcon,
      label: t('settings', { ns: 'settings' }),
      path: RouterPaths.settings.absolutePath,
    },
  ];

  if (DBDESK_URL) {
    items.push({
      icon: DbdeskIcon,
      label: t('SQL Editor', { ns: 'shared', defaultValue: 'SQL Editor' }),
      path: RouterPaths.sqlEditor.absolutePath,
    });
  }

  return items;
};

export const sidebarLowData = (t: TFunction) => [
  {
    icon: GithubIcon,
    label: t('github', { ns: 'shared' }),
    path: 'https://github.com/vitabaks/autobase',
  },
  {
    icon: DocumentationIcon,
    label: t('documentation', { ns: 'shared' }),
    path: 'https://autobase.tech/docs',
  },
  {
    icon: SupportIcon,
    label: t('support', { ns: 'shared' }),
    path: 'https://autobase.tech/docs/support',
  },
  {
    icon: SponsorIcon,
    label: t('sponsor', { ns: 'shared' }),
    path: 'https://autobase.tech/docs/sponsor',
  },
];

export const OPEN_SIDEBAR_WIDTH = '222px';

export const COLLAPSED_SIDEBAR_WIDTH = '66px';
