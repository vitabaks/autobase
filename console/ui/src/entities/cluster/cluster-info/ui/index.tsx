import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ClusterInfoProps } from '@entities/cluster/cluster-info/model/types.ts';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { useGetClusterInfoConfig } from '@entities/cluster/cluster-info/lib/hooks.tsx';
import InfoCardBody from '@shared/ui/info-card-body';

const ClusterInfo: FC<ClusterInfoProps> = ({ postgresVersion, clusterName, description, environment, location }) => {
  const { t } = useTranslation(['clusters', 'shared']);

  const config = useGetClusterInfoConfig({
    postgresVersion,
    clusterName,
    description,
    environment,
    location,
  });

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <EditNoteOutlinedIcon />
        <Typography>{t('clusterInfo')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <InfoCardBody config={config} />
      </AccordionDetails>
    </Accordion>
  );
};

export default ClusterInfo;
