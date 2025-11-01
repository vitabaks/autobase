import { FC } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  DCS_BLOCK_FIELD_NAMES,
  DCS_DATABASES_DEFAULT_VALUES,
  DCS_TYPES,
} from '@entities/cluster/expert-mode/dcs-block/model/const.ts';
import AddIcon from '@mui/icons-material/Add';
import DcsDatabaseBox from '@entities/cluster/expert-mode/dcs-block/ui/DcsDatabaseBox.tsx';

const DcsBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: DCS_BLOCK_FIELD_NAMES.DATABASES,
  });

  const addServer = () => append(DCS_DATABASES_DEFAULT_VALUES);

  const removeServer = (index: number) => () => remove(index);

  const watchIsDeployNewCluster = useWatch({ name: DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_NEW_CLUSTER });

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        DCS
      </Typography>
      <Stack direction="column" gap={1}>
        <Controller
          control={control}
          name={DCS_BLOCK_FIELD_NAMES.TYPE}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <InputLabel size="small">{t('dcsType')}</InputLabel>
              <Select
                {...field}
                size="small"
                label={t('dcsType')}
                error={!!errors[DCS_BLOCK_FIELD_NAMES.TYPE]}
                helperText={errors[DCS_BLOCK_FIELD_NAMES.TYPE]?.message as string}>
                {DCS_TYPES.map((mode) => (
                  <MenuItem key={mode} value={mode}>
                    {mode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name={DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_NEW_CLUSTER}
          render={({ field }) => (
            <Stack direction="row" alignItems="center">
              <Stack direction="row" alignItems="center" width={250}>
                <Typography marginRight={1}>{t('deployNewDcsCluster')}</Typography>
                <Tooltip title={t('deployNewDcsClusterTooltip')}>
                  <HelpOutlineIcon fontSize="small" />
                </Tooltip>
              </Stack>
              <Checkbox {...field} checked={!!field.value} />
            </Stack>
          )}
        />
        {watchIsDeployNewCluster ? (
          <Controller
            control={control}
            name={DCS_BLOCK_FIELD_NAMES.IS_DEPLOY_TO_DB_SERVERS}
            render={({ field }) => (
              <Stack direction="row" alignItems="center">
                <Stack direction="row" alignItems="center" width={250}>
                  <Typography marginRight={1}>{t('deployToDbServers')}</Typography>
                  <Tooltip title={t('deployToDbServersTooltip')}>
                    <HelpOutlineIcon fontSize="small" />
                  </Tooltip>
                </Stack>
                <Checkbox {...field} checked={!!field.value} />
              </Stack>
            )}
          />
        ) : (
          <Stack direction="column" gap="16px" justifyContent="center" alignItems="flex-start">
            <Box display="flex" gap="16px" flexWrap="wrap" justifyContent="flex-start" alignItems="center">
              {fields.map((field, index) => (
                <DcsDatabaseBox
                  key={field.id}
                  index={index}
                  {...(index !== 0 ? { remove: removeServer(index) } : {})} // removing entity such way is required to avoid bugs with a wrong element removed
                />
              ))}
            </Box>
            <Button onClick={addServer}>
              <AddIcon />
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default DcsBlock;
