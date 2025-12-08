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
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { ConnectionPoolBlockProps } from '@entities/cluster/expert-mode/connection-pools-block/model/types.ts';
import {
  CONNECTION_POOLS_BLOCK_FIELD_NAMES,
  POOL_MODES,
} from '@entities/cluster/expert-mode/connection-pools-block/model/const.ts';
import { DATABASES_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/databases-block/model/const.ts';

const ConnectionPoolBox: FC<ConnectionPoolBlockProps> = ({ index, remove }) => {
  const { t } = useTranslation(['clusters', 'shared']);
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    // set default name as corresponding database name from databases form block if available
    const watchCorrespondingDatabaseName = getValues(
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
        <Stack direction="column" alignItems="flex-start" gap={2}>
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
                  helperText={
                    errors?.[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS]?.[index]?.[fieldName]?.message as string
                  }
                />
              )}
            />
          ))}
          <Controller
            control={control}
            name={`${CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS}.${index}.${CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_MODE}`}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel size="small">{t('poolMode')}</InputLabel>
                <Select
                  {...field}
                  size="small"
                  label={t('poolMode')}
                  error={
                    !!errors[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS]?.[index]?.[
                      CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_MODE
                    ]
                  }
                  helperText={
                    errors[CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOLS]?.[index]?.[
                      CONNECTION_POOLS_BLOCK_FIELD_NAMES.POOL_MODE
                    ]?.message
                  }>
                  {POOL_MODES.map((mode) => (
                    <MenuItem key={mode.option} value={mode.option}>
                      <Tooltip title={mode.tooltip}>{mode.option}</Tooltip>
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
