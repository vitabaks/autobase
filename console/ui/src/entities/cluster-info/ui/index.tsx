import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ClusterInfoProps } from '@entities/cluster-info/model/types.ts';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { useGetClusterInfoConfig } from '@entities/cluster-info/lib/hooks.tsx';
import InfoCardBody from '@shared/ui/info-card-body';

const ClusterInfo: FC<ClusterInfoProps> = ({ postgresVersion, clusterName, description, environment, location }) => {
  const { t } = useTranslation(['clusters', 'shared']);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);

  const config = useGetClusterInfoConfig({
    postgresVersion,
    clusterName,
    description,
    environment,
    location,
  });

  const handleOpenConfigDialog = () => {
    setConfigDialogOpen(true);
  };

  const handleCloseConfigDialog = () => {
    setConfigDialogOpen(false);
  };

  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <EditNoteOutlinedIcon />
          <Typography>{t('clusterInfo')}</Typography>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<SettingsIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenConfigDialog();
            }}
            sx={{ ml: 'auto', mr: 2 }}
          >
            {t('viewConfig', { ns: 'clusters' })}
          </Button>
        </AccordionSummary>
        <AccordionDetails>
          <InfoCardBody config={config} />
        </AccordionDetails>
      </Accordion>

      <Dialog 
        open={configDialogOpen} 
        onClose={handleCloseConfigDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('clusterConfiguration', { ns: 'clusters' })}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            {t('clusterName')}: {clusterName}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('configurationDescription', { ns: 'clusters' })}
          </Typography>
          {/* Here you would add a form or visualization of the cluster configuration */}
          {/* This is a placeholder for the actual configuration UI */}
          <pre style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '4px', overflow: 'auto' }}>
            {`# PostgreSQL Configuration
postgresql:
  listen: 0.0.0.0:5432
  data_dir: /var/lib/postgresql/data
  bin_dir: /usr/lib/postgresql/${postgresVersion}/bin
  
# Patroni Configuration
patroni:
  name: ${clusterName}
  scope: ${clusterName}
  environment: ${environment || 'production'}
  
# Connection Info
connection:
  host: ${location || 'localhost'}
  port: 5432
  database: postgres
  user: postgres`}
          </pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfigDialog}>{t('close', { ns: 'shared' })}</Button>
          <Button variant="contained" color="primary">
            {t('saveChanges', { ns: 'shared' })}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClusterInfo;
