import { TFunction } from 'i18next';
import RouterPaths from '@app/router/routerPathsConfig';
import ClustersIcon from '@assets/clustersIcon.svg?react';
import OperationsIcon from '@assets/operationsIcon.svg?react';
import SettingsIcon from '@assets/settingsIcon.svg?react';
import GithubIcon from '@assets/githubIcon.svg?react';
import DocumentationIcon from '@assets/docsIcon.svg?react';
import SupportIcon from '@assets/supportIcon.svg?react';
import SponsorIcon from '@assets/sponsorIcon.svg?react';

export const sidebarData = (t: TFunction) => [
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

export const OPEN_SIDEBAR_WIDTH = '220px';

export const COLLAPSED_SIDEBAR_WIDTH = '62px';
