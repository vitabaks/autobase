import { FC } from 'react';
import { Divider, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { useFormContext, useWatch } from 'react-hook-form';
import { useGetSummaryConfig } from '@widgets/cluster-summary/lib/hooks.tsx';
import { PROVIDERS } from '@shared/config/constants.ts';
import InfoCardBody from '@shared/ui/info-card-body';
import { clusterSummaryNameIconProvidersMap } from '@widgets/cluster-summary/model/constants.ts';

const ClusterSummary: FC = () => {
  const { t } = useTranslation(['clusters', 'shared']);
  const { control } = useFormContext();

  const watchValues = useWatch({
    control,
  });

  const config = useGetSummaryConfig({
    isCloudProvider: watchValues[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code !== PROVIDERS.LOCAL,
    data: {
      ...watchValues,
      [CLUSTER_FORM_FIELD_NAMES.PROVIDER]: {
        ...watchValues[CLUSTER_FORM_FIELD_NAMES.PROVIDER],
        icon: clusterSummaryNameIconProvidersMap[watchValues[CLUSTER_FORM_FIELD_NAMES.PROVIDER]?.code],
      },
    },
  });

  return (
    <Paper
      sx={{
        position: 'sticky',
        top: '100px',
        margin: '16px',
        width: '370px',
        height: 'fit-content',
        padding: '16px 24px 16px 24px',
      }}
      variant="elevation">
      <Typography fontWeight="bold" variant="h6" marginY="4px" marginX="16px">
        {t('summary')}
      </Typography>
      <Divider />
      <InfoCardBody config={config} />
    </Paper>
  );
};

export default ClusterSummary;
