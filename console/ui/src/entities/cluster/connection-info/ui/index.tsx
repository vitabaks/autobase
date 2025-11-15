import { FC } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ConnectionInfoProps } from '@entities/cluster/connection-info/model/types.ts';
import PowerOutlinedIcon from '@mui/icons-material/PowerOutlined';
import { useGetConnectionInfoConfig } from '@entities/cluster/connection-info/lib/hooks.tsx';
import InfoCardBody from '@shared/ui/info-card-body';

const ConnectionInfo: FC<ConnectionInfoProps> = ({ connectionInfo }) => {
  const { t } = useTranslation(['clusters', 'shared']);

  const config = useGetConnectionInfoConfig({ connectionInfo });

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <PowerOutlinedIcon />
        <Typography>{t('connectionInfo')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <InfoCardBody config={config} />
      </AccordionDetails>
    </Accordion>
  );
};

export default ConnectionInfo;
