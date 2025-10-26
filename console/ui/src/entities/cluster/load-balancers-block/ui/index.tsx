import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, Checkbox, Stack, Tooltip, Typography } from '@mui/material';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const LoadBalancersBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const { control } = useFormContext();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('loadBalancers')}
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="flex-start" gap="8px">
        <Typography>{t('haproxyLoadBalancer')}</Typography>
        <Tooltip title={t('haproxyLoadBalancerTooltip')}>
          <HelpOutlineIcon fontSize="small" />
        </Tooltip>
        <Controller
          control={control}
          name={CLUSTER_FORM_FIELD_NAMES.IS_HAPROXY_LOAD_BALANCER}
          render={({ field: { value, onChange } }) => <Checkbox checked={value} onChange={onChange} />}
        />
      </Stack>
    </Box>
  );
};

export default LoadBalancersBlock;
