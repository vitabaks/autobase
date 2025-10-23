import { FC } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import ConnectionPoolBox from '@entities/connection-pools-block/ui/ConnectionPoolBox.tsx';
import { CONNECTION_POOLS_BLOCK_FIELD_NAMES, POOL_MODES } from '@entities/connection-pools-block/model/const.ts';

const ConnectionPoolsBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const { control, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS,
  });

  const watchIsConnectionPoolerEnabled = watch(CONNECTION_POOLS_BLOCK_FIELD_NAMES.IS_CONNECTION_POOLER_ENABLED);

  const appendItem = () =>
    append({
      [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_NAME]: '',
      [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_SIZE]: 20,
      [CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_MODE]: POOL_MODES[0],
    });
  const removeServer = (index: number) => () => remove(index);

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('connectionPools')}
      </Typography>
      <Stack direction="column" gap={2} justifyContent="center" alignItems="flex-start">
        <Controller
          control={control}
          name={CONNECTION_POOLS_BLOCK_FIELD_NAMES.IS_CONNECTION_POOLER_ENABLED}
          render={({ field }) => (
            <FormControlLabel
              {...field}
              checked={!!field.value}
              control={<Checkbox />}
              sx={{
                marginLeft: 0,
              }}
              labelPlacement="start"
              label={
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  {t('connectionPooler')}
                </Box>
              }
            />
          )}
        />
        {watchIsConnectionPoolerEnabled ? (
          <Box display="flex" gap="16px" flexWrap="wrap" justifyContent="flex-start" alignItems="center">
            {fields.map((field, index) => (
              <ConnectionPoolBox
                key={field.id}
                index={index}
                {...(index !== 0 ? { remove: removeServer(index) } : {})} // removing entity such way is required to avoid bugs with a wrong element removed
              />
            ))}
          </Box>
        ) : null}
        <Button onClick={appendItem}>
          <AddIcon />
        </Button>
      </Stack>
    </Box>
  );
};

export default ConnectionPoolsBlock;
