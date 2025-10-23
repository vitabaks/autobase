import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, Checkbox, FormControlLabel, Tooltip, Typography, useTheme } from '@mui/material';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import ClusterSliderBox from '@shared/ui/slider-box';
import ServersIcon from '@shared/assets/instanceIcon.svg?react';
import { IS_EXPERT_MODE } from '@shared/model/constants.ts';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { PROVIDERS } from '@shared/config/constants.ts';
import { INSTANCES_AMOUNT_BLOCK_VALUES } from '@entities/cluster-form-instances-amount-block/model/const.ts';

const InstancesAmountBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const theme = useTheme();

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const watchProvider = watch(CLUSTER_FORM_FIELD_NAMES.PROVIDER);

  const isRightsElementNeeded = [PROVIDERS.AWS, PROVIDERS.GCP, PROVIDERS.GCP].includes(watchProvider);

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('numberOfInstances')}
      </Typography>
      <Controller
        control={control}
        name={INSTANCES_AMOUNT_BLOCK_VALUES.INSTANCES_AMOUNT}
        render={({ field: { onChange, value } }) => (
          <ClusterSliderBox
            min={1}
            max={32}
            step={1}
            marksAmount={10}
            amount={value as number}
            changeAmount={onChange}
            icon={<ServersIcon width="24px" height="24px" style={{ fill: theme.palette.text.primary }} />}
            error={errors[INSTANCES_AMOUNT_BLOCK_VALUES.INSTANCES_AMOUNT]}
            topRightElements={
              IS_EXPERT_MODE && isRightsElementNeeded ? (
                <Controller
                  control={control}
                  name={INSTANCES_AMOUNT_BLOCK_VALUES.IS_SPOT_INSTANCES}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      sx={{
                        marginLeft: 0,
                      }}
                      labelPlacement="start"
                      label={
                        <Box display="inline-flex" alignItems="center" gap={0.5}>
                          {t('spotInstances')}
                          <Tooltip title={t('spotInstancesTooltip')}>
                            <HelpOutlineIcon fontSize="small" />
                          </Tooltip>
                        </Box>
                      }
                    />
                  )}
                />
              ) : null
            }
          />
        )}
      />
    </Box>
  );
};

export default InstancesAmountBlock;
