import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import ConfigureKernelParametersModal from '@entities/kernel-parameters-block/ui/ConfigureKernelParametersModal.tsx';

const KernelParametersBlock: FC = () => {
  const { t } = useTranslation('clusters');

  return (
    <Stack>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('kernelParameters')}
      </Typography>
      <Stack direction="column" spacing={1} alignItems="flex-start">
        <Stack direction="column">
          <Stack direction="row" gap={0.5} alignItems="center">
            <InfoOutlineIcon fontSize="small" />
            <Typography>{t('kernelParametersInfo')}</Typography>
          </Stack>
          <Typography>{t('specifyIfQualified')}</Typography>
        </Stack>
        <ConfigureKernelParametersModal />
      </Stack>
    </Stack>
  );
};

export default KernelParametersBlock;
