import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ConfigurePostgresParametersModal from '@entities/postgres-parameters-block/ui/ConfigurePostgresParametersModal.tsx';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

const PostgresParametersBlock: FC = () => {
  const { t } = useTranslation('clusters');

  return (
    <Stack>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('postgresParameters')}
      </Typography>
      <Stack direction="column" spacing={1} alignItems="flex-start">
        <Stack direction="column">
          <Stack direction="row" gap={0.5} alignItems="center">
            <InfoOutlineIcon fontSize="small" />
            <Typography>{t('postgresParametersInfo')}</Typography>
          </Stack>
          <Typography>{t('specifyIfQualified')}</Typography>
        </Stack>
        <ConfigurePostgresParametersModal />
      </Stack>
    </Stack>
  );
};

export default PostgresParametersBlock;
