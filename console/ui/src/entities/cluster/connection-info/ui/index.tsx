import { FC } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StorageIcon from '@mui/icons-material/Storage';
import { ConnectionInfoProps } from '@entities/cluster/connection-info/model/types.ts';
import PowerOutlinedIcon from '@mui/icons-material/PowerOutlined';
import { useGetConnectionInfoConfig } from '@entities/cluster/connection-info/lib/hooks.tsx';
import InfoCardBody from '@shared/ui/info-card-body';
import { DBDESK_URL, DBDESK_HOST_REWRITE } from '@shared/config/constants.ts';
import RouterPaths from '@app/router/routerPathsConfig';

/**
 * Rewrite localhost/127.0.0.1 addresses so that dbdesk-studio (running in a
 * container) can actually reach the database. The DBDESK_HOST_REWRITE env var
 * lets operators specify the hostname visible from the dbdesk container
 * (e.g. "host.containers.internal" for Podman, "host.docker.internal" for Docker).
 */
const rewriteHost = (address: string): string => {
  if (!DBDESK_HOST_REWRITE) return address;
  const locals = ['127.0.0.1', 'localhost', '0.0.0.0'];
  return locals.includes(address.trim()) ? DBDESK_HOST_REWRITE : address;
};

const ConnectionInfo: FC<ConnectionInfoProps> = ({ connectionInfo, servers }) => {
  const { t } = useTranslation(['clusters', 'shared']);
  const navigate = useNavigate();

  const config = useGetConnectionInfoConfig({ connectionInfo });

  const buildConnectionUri = () => {
    const user = connectionInfo?.superuser || 'postgres';
    const password = connectionInfo?.password || '';

    // Resolve address: prefer connection_info, fall back to first server IP
    let address: string;
    if (typeof connectionInfo?.address === 'string') {
      address = connectionInfo.address;
    } else if (connectionInfo?.address && Object.values(connectionInfo.address).length > 0) {
      address = Object.values(connectionInfo.address)[0];
    } else if (servers?.length && servers[0].ip) {
      address = servers[0].ip;
    } else {
      address = 'localhost';
    }

    // Resolve port: prefer connection_info, default 5432
    let port: string;
    if (typeof connectionInfo?.port === 'string') {
      port = connectionInfo.port;
    } else if (connectionInfo?.port && Object.values(connectionInfo.port).length > 0) {
      port = Object.values(connectionInfo.port)[0];
    } else {
      port = '5432';
    }

    address = rewriteHost(address);

    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${encodeURIComponent(address)}:${encodeURIComponent(port)}/postgres`;
  };

  const hasConnectionData = connectionInfo?.address || connectionInfo?.superuser || (servers?.length ?? 0) > 0;

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <PowerOutlinedIcon />
        <Typography>{t('connectionInfo')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <InfoCardBody config={config} />
        {DBDESK_URL && hasConnectionData && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<StorageIcon />}
            onClick={() => {
              const connectionUri = buildConnectionUri();
              if (connectionUri) {
                navigate(RouterPaths.sqlEditor.absolutePath, { state: { uri: connectionUri } });
              }
            }}
            sx={{ mt: 2 }}>
            {t('openInSqlEditor', { ns: 'shared' })}
          </Button>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ConnectionInfo;
