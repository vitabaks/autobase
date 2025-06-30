import { FC } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import ClusterSliderBox from '@shared/ui/slider-box';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import StorageIcon from '@shared/assets/storageIcon.svg?react';

const StorageBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const theme = useTheme();

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const watchProvider = watch(CLUSTER_FORM_FIELD_NAMES.PROVIDER);

  const storage = watchProvider?.volumes?.find((volume) => volume?.is_default) ?? {};

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('dataDiskStorage')}
      </Typography>
      <Controller
        control={control}
        name={CLUSTER_FORM_FIELD_NAMES.STORAGE_AMOUNT}
        render={({ field: { onChange, value } }) => (
          <ClusterSliderBox
            min={storage?.min_size ?? 1}
            max={storage?.max_size ?? 100}
            marksAdditionalLabel="GB"
            marksAmount={10}
            step={100}
            amount={value}
            changeAmount={onChange}
            unit="GB"
            limitMax
            icon={<StorageIcon width="24px" height="24px" style={{ fill: theme.palette.text.primary }} />}
            error={errors[CLUSTER_FORM_FIELD_NAMES.STORAGE_AMOUNT]}
          />
        )}
      />
    </Box>
  );
};

export default StorageBlock;
