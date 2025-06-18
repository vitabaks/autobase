import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@mui/material';
import EyeIcon from '@mui/icons-material/VisibilityOutlined';

import CopyIcon from '@shared/ui/copy-icon';
import ConnectionInfoRowContainer from '@entities/connection-info/ui/ConnectionInfoRowConteiner.tsx';
import { ConnectionInfoProps } from '@entities/connection-info/model/types.ts';

export const useGetConnectionInfoConfig = (
  { connectionInfo }: { connectionInfo: ConnectionInfoProps }
): { title: string; children: React.ReactNode }[] => {
  const { t } = useTranslation(['clusters', 'shared']);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const togglePasswordVisibility = () => setIsPasswordHidden((prev) => !prev);

  const iconFontSize = '16px';

  const renderCollection = (collection: string | object, defaultLabel: string) => {
    if (typeof collection === 'string' || typeof collection === 'number') {
      return [{
        title: defaultLabel,
        children: (
          <ConnectionInfoRowContainer>
            <Typography>{collection}</Typography>
            <CopyIcon valueToCopy={collection} sx={{ fontSize: iconFontSize }} />
          </ConnectionInfoRowContainer>
        ),
      }];
    }

    if (typeof collection === 'object' && collection !== null) {
      return Object.entries(collection).map(([key, value]) => ({
        title: `${defaultLabel} ${key}`,
        children: (
          <ConnectionInfoRowContainer>
            <Typography>{value}</Typography>
            <CopyIcon valueToCopy={value} sx={{ fontSize: iconFontSize }} />
          </ConnectionInfoRowContainer>
        ),
      }));
    }

    return [];
  };

  return [
    ...(connectionInfo?.address ? renderCollection(connectionInfo.address, t('address', { ns: 'shared' })) : []),
    ...(connectionInfo?.port ? renderCollection(connectionInfo.port, t('port', { ns: 'clusters' })) : []),
    {
      title: t('user', { ns: 'shared' }),
      children: (
        <ConnectionInfoRowContainer>
          <Typography>{connectionInfo?.superuser || 'postgres'}</Typography>
          <CopyIcon valueToCopy={connectionInfo?.superuser || 'postgres'} sx={{ fontSize: iconFontSize }} />
        </ConnectionInfoRowContainer>
      ),
    },
    {
      title: t('password', { ns: 'shared' }),
      children: (
        <ConnectionInfoRowContainer>
          <Typography>
            {isPasswordHidden
              ? (connectionInfo?.password || 'N/A').replace(/./g, '*')
              : (connectionInfo?.password || 'N/A')}
          </Typography>
          <Stack direction="row" alignItems="center" gap={1}>
            <EyeIcon
              onClick={togglePasswordVisibility}
              sx={{ cursor: 'pointer', fontSize: iconFontSize }}
            />
            <CopyIcon valueToCopy={connectionInfo?.password || 'N/A'} sx={{ fontSize: iconFontSize }} />
          </Stack>
        </ConnectionInfoRowContainer>
      ),
    },
  ];
};
