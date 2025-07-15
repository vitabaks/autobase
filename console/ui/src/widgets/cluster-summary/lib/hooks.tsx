import { Icon, Link, Stack, Typography, useTheme } from '@mui/material';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { Trans, useTranslation } from 'react-i18next';
import { providerNamePricingListMap } from '@widgets/cluster-summary/model/constants.ts';
import RamIcon from '@shared/assets/ramIcon.svg?react';
import InstanceIcon from '@shared/assets/instanceIcon.svg?react';
import StorageIcon from '@shared/assets/storageIcon.svg?react';
import LanIcon from '@shared/assets/lanIcon.svg?react';
import FlagIcon from '@shared/assets/flagIcon.svg?react';
import CheckIcon from '@shared/assets/checkIcon.svg?react';
import CpuIcon from '@shared/assets/cpuIcon.svg?react';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import {
  CloudProviderClustersSummary,
  LocalClustersSummary,
  UseGetSummaryConfigProps,
} from '@widgets/cluster-summary/model/types.ts';

const useGetCloudProviderConfig = () => {
  const { t } = useTranslation(['clusters', 'shared']);
  const theme = useTheme();

  return (data: CloudProviderClustersSummary) => {
    const defaultVolume = data[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.volumes?.find((volume) => volume?.is_default) ?? {};

    return [
      {
        title: t('name'),
        children: <Typography>{data[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME]}</Typography>,
      },
      {
        title: t('postgresVersion'),
        children: <Typography>{data[CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION]}</Typography>,
      },
      {
        title: t('cloud'),
        children: (
          <Stack direction={'row'} spacing={1} alignItems="center">
            <Icon fontSize="large" sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={data[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.icon}
                alt={data[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.description?.[0]}
                style={{ width: '30px', height: '30px', objectFit: 'contain' }}
              />
            </Icon>
            <Typography>{data[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.description}</Typography>
          </Stack>
        ),
      },
      {
        title: t('region'),
        children: (
          <Stack direction={'column'}>
            <Typography>{data[CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG]?.code}</Typography>
            <Stack direction={'row'} spacing={1} alignItems="center">
              <FlagIcon height="24px" width="24px" style={{ fill: theme.palette.text.primary }} />
              <Typography>{data[CLUSTER_FORM_FIELD_NAMES.REGION_CONFIG]?.location}</Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        title: t('instanceType'),
        children: (
          <Stack direction={'column'}>
            <Typography>{data[CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG]?.code}</Typography>
            <Stack direction={'row'} spacing={1} alignItems="center">
              <Stack direction={'row'} spacing={0.5} alignItems="center">
                <CpuIcon height="24px" width="24px" style={{ fill: theme.palette.text.primary }} />
                <Typography>{data[CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG]?.cpu} CPU</Typography>
              </Stack>
              <Stack direction={'row'} spacing={0.5} alignItems="center">
                <RamIcon height="24px" width="24px" style={{ fill: theme.palette.text.primary }} />
                <Typography>{data[CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG]?.ram} GB RAM</Typography>
              </Stack>
            </Stack>
          </Stack>
        ),
      },
      {
        title: t('numberOfInstances'),
        children: (
          <Stack direction={'row'} spacing={0.5} alignItems="center">
            <InstanceIcon height="24px" width="24px" style={{ fill: theme.palette.text.primary }} />
            <Typography>{data[CLUSTER_FORM_FIELD_NAMES.INSTANCES_AMOUNT]}</Typography>
          </Stack>
        ),
      },
      {
        title: t('dataDiskStorage'),
        children: (
          <Stack direction={'row'} spacing={0.5} alignItems="center" minHeight="20px">
            <StorageIcon height="24px" width="24px" style={{ fill: theme.palette.text.primary }} />
            <Typography>{data[CLUSTER_FORM_FIELD_NAMES.STORAGE_AMOUNT]} GB</Typography>
          </Stack>
        ),
      },
      {
        title: `${t('estimatedMonthlyPrice')}*`,
        children: (
          <>
            <Typography variant="h5" fontWeight="bold">
              ~
              {`${data[CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG]?.currency}${(
                data[CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG]?.price_monthly *
                  data[CLUSTER_FORM_FIELD_NAMES.INSTANCES_AMOUNT] +
                defaultVolume?.price_monthly *
                  data[CLUSTER_FORM_FIELD_NAMES.STORAGE_AMOUNT] *
                  data[CLUSTER_FORM_FIELD_NAMES.INSTANCES_AMOUNT]
              )?.toFixed(2)}/${t('month', { ns: 'shared' })}`}
            </Typography>
            <Stack direction="row" gap={1}>
              <Typography>
                ~
                {`${data[CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG]?.currency}${data[
                  CLUSTER_FORM_FIELD_NAMES.INSTANCE_CONFIG
                ]?.price_monthly.toFixed(2)}/${t('perServer', { ns: 'clusters' })}`}
                , ~
                {`${defaultVolume?.currency}${(
                  defaultVolume?.price_monthly * data[CLUSTER_FORM_FIELD_NAMES.STORAGE_AMOUNT]
                )?.toFixed(2)}/${t('perDisk', { ns: 'clusters' })}`}
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="caption" whiteSpace="pre-line">
              <Trans i18nKey="estimatedCostAdditionalInfo" t={t}>
                <Link
                  target="_blank"
                  href={providerNamePricingListMap[data[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code]}
                  color="text.secondary"
                />
              </Trans>
            </Typography>
          </>
        ),
      },
    ];
  };
};

const useGetLocalMachineConfig = () => {
  const { t } = useTranslation(['clusters', 'shared']);
  const theme = useTheme();

  return (data: LocalClustersSummary) => [
    {
      title: t('name'),
      children: <Typography>{data[CLUSTER_FORM_FIELD_NAMES.CLUSTER_NAME]}</Typography>,
    },
    {
      title: t('postgresVersion'),
      children: <Typography>{data[CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION]}</Typography>,
    },
    {
      title: t('numberOfServers'),
      children: (
        <Stack direction={'row'} spacing={0.5} alignItems="center">
          <InstanceIcon height="24px" width="24px" style={{ fill: theme.palette.text.primary }} />
          <Typography>{data[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS]?.length}</Typography>
        </Stack>
      ),
    },
    {
      title: t('loadBalancing'),
      children: (
        <Stack direction={'row'} spacing={0.5} alignItems="center">
          <LanIcon height="24px" width="24px" style={{ fill: theme.palette.text.primary }} />
          <Typography>
            {data[CLUSTER_FORM_FIELD_NAMES.IS_HAPROXY_LOAD_BALANCER]
              ? t('on', { ns: 'shared' })
              : t('off', { ns: 'shared' })}
          </Typography>
        </Stack>
      ),
    },
    {
      title: t('highAvailability'),
      children: (
        <Stack direction="column" spacing={0.5}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            {data[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS]?.length >= 3 ? (
              <CheckIcon width="24px" height="24px" style={{ fill: theme.palette.text.primary }} />
            ) : (
              <WarningAmberOutlinedIcon />
            )}
            <Typography>
              {data[CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS]?.length >= 3
                ? t('on', { ns: 'shared' })
                : t('off', { ns: 'shared' })}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {t('highAvailabilityInfo')}
          </Typography>
        </Stack>
      ),
    },
  ];
};

export const useGetSummaryConfig = ({ isCloudProvider, data }: UseGetSummaryConfigProps) => {
  const cloudProviderConfig = useGetCloudProviderConfig();
  const localProviderConfig = useGetLocalMachineConfig();

  return isCloudProvider
    ? cloudProviderConfig(data as CloudProviderClustersSummary)
    : localProviderConfig(data as LocalClustersSummary);
};
