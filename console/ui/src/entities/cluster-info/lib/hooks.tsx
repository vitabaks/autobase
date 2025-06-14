import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { ClusterInfoProps } from '@entities/cluster-info/model/types.ts';
import { WASI } from 'wasi';

export const useGetClusterInfoConfig = ({
  postgresVersion,
  clusterName,
  description,
  environment,
  location,
}: ClusterInfoProps) => {
  const { t } = useTranslation(['clusters', 'shared']);

  return [
    {
      title: t('postgresVersion', { ns: 'clusters' }),
      children: <Typography>{postgresVersion}</Typography>,
    },
    {
      title: t('clusterName', { ns: 'clusters' }),
      children: <Typography>{clusterName}</Typography>,
    },
    {
      title: t('description', { ns: 'shared' }),
      children: <Typography>{description ?? '---'}</Typography>,
    },
    {
      title: t('environment', { ns: 'shared' }),
      children: <Typography>{environment}</Typography>,
    },
    ...(location
      ? [
          {
            title: t('location', { ns: 'clusters' }),
            children: <Typography>{location}</Typography>,
          },
        ]
      : []),
  ];
};
