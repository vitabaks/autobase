import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import ClusterSliderBox from '@shared/ui/slider-box';
import ServersIcon from '@shared/assets/instanceIcon.svg?react';

const InstancesAmountBlock: FC = () => {
  const { t } = useTranslation('clusters');

  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('numberOfInstances')}
      </Typography>
      <Controller
        control={control}
        name={CLUSTER_FORM_FIELD_NAMES.INSTANCES_AMOUNT}
        render={({ field: { onChange, value } }) => (
          <ClusterSliderBox
            min={1}
            max={32}
            step={1}
            marksAmount={10}
            amount={value as number}
            changeAmount={onChange}
            icon={<ServersIcon width="24px" height="24px" />}
            error={errors[CLUSTER_FORM_FIELD_NAMES.INSTANCES_AMOUNT]}
          />
        )}
      />
    </Box>
  );
};

export default InstancesAmountBlock;
