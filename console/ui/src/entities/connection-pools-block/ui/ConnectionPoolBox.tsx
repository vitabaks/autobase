import { FC, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Card,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { ConnectionPoolBlockProps } from '@entities/connection-pools-block/model/types.ts';
import { CONNECTION_POOLS_BLOCK_FIELD_NAMES, POOL_MODES } from '@entities/connection-pools-block/model/const.ts';
import { DATABASES_BLOCK_FIELD_NAMES } from '@entities/databases-block/model/const.ts';

const ConnectionPoolBox: FC<ConnectionPoolBlockProps> = ({ index, remove }) => {
  const { t } = useTranslation('clusters');
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    // set default name as corresponding database name from databases form block if available
    const watchCorrespondingDatabaseName = watch(
      `${DATABASES_BLOCK_FIELD_NAMES.DATABASES}.${index}.${DATABASES_BLOCK_FIELD_NAMES.DATABASE_NAME}`,
    );
    if (watchCorrespondingDatabaseName)
      setValue(
        `${CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS}.${index}.${CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_NAME}`,
        watchCorrespondingDatabaseName,
      );
  }, []);

  return (
    <Card sx={{ position: 'relative', padding: '16px', minWidth: '200px' }}>
      {remove ? (
        <IconButton sx={{ position: 'absolute', right: '4px', top: '4px', cursor: 'pointer' }} onClick={remove}>
          <CloseIcon />
        </IconButton>
      ) : null}
      <Stack direction="column" gap={2}>
        <Typography fontWeight="bold">{`${t('pool', { ns: 'clusters' })} ${index + 1}`}</Typography>
        <Stack direction="column" alignItems="flex-start">
          {[
            {
              fieldName: CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_NAME,
              label: t('poolName', { ns: 'clusters' }),
            },
            {
              fieldName: CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_SIZE,
              label: t('poolSize', { ns: 'clusters' }),
            },
          ].map(({ fieldName, label }) => (
            <Controller
              key={fieldName}
              control={control}
              name={`${CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS}.${index}.${fieldName}`}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  label={label}
                  error={!!errors[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS]?.[index]?.[fieldName]}
                  helperText={errors?.[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS]?.[index]?.[fieldName]?.message ?? ' '}
                />
              )}
            />
          ))}
          <Controller
            control={control}
            name={CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_MODE}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel size="small">{t('poolMode')}</InputLabel>
                <Select
                  {...field}
                  size="small"
                  fullWidth
                  error={!!errors[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_MODE]}
                  helperText={errors[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_MODE]?.message}>
                  {POOL_MODES.map((mode) => (
                    <MenuItem key={mode} value={mode}>
                      {mode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Stack>
      </Stack>
    </Card>
  );
};

export default ConnectionPoolBox;
