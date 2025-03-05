import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import CopyIcon from '@shared/ui/copy-icon';
import EyeIcon from '../assets/eyeIcon.svg?react';
import ConnectionInfoRowContainer from '@entities/connection-info/ui/ConnectionInfoRowConteiner.tsx';
import { ConnectionInfoProps } from '@entities/connection-info/model/types.ts';

export const useGetConnectionInfoConfig = ({ connectionInfo }: { connectionInfo: ConnectionInfoProps }) => {
  const { t } = useTranslation(['clusters', 'shared']);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const togglePasswordVisibility = () => setIsPasswordHidden((prev) => !prev);

  const renderCollection = (collection: string | object, defaultLabel: string) => {
    return ['string', 'number'].includes(typeof collection)
      ? [
          {
            title: defaultLabel,
            children: (
              <ConnectionInfoRowContainer>
                <Typography>{collection}</Typography> <CopyIcon valueToCopy={collection} />
              </ConnectionInfoRowContainer>
            ),
          },
        ]
      : typeof collection === 'object'
        ? Object.entries(collection)?.map(([key, value]) => ({
            title: `${defaultLabel} ${key}`,
            children: (
              <ConnectionInfoRowContainer>
                <Typography>{value}</Typography> <CopyIcon valueToCopy={value} />
              </ConnectionInfoRowContainer>
            ),
          })) ?? []
        : [];
  };

  return [
    ...(connectionInfo?.address ? renderCollection(connectionInfo.address, t('address', { ns: 'shared' })) : []),
    ...(connectionInfo?.port ? renderCollection(connectionInfo.port, t('port', { ns: 'clusters' })) : []),
    {
      title: t('user', { ns: 'shared' }),
      children: (
        <ConnectionInfoRowContainer>
          <Typography>{connectionInfo?.superuser}</Typography> <CopyIcon valueToCopy={connectionInfo?.superuser} />
        </ConnectionInfoRowContainer>
      ),
    },
    {
      title: t('password', { ns: 'shared' }),
      children: (
        <ConnectionInfoRowContainer>
          <Typography>
            {isPasswordHidden ? connectionInfo?.password?.replace(/./g, '*') : connectionInfo?.password}
          </Typography>
          <Stack direction="row" alignItems="center" gap={1}>
            <EyeIcon onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />
            <CopyIcon valueToCopy={connectionInfo?.password} />
          </Stack>
        </ConnectionInfoRowContainer>
      ),
    },
  ];
};
