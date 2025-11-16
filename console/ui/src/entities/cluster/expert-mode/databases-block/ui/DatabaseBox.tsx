import { FC, startTransition, useEffect, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Card, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { DatabasesBlockProps } from '@entities/cluster/expert-mode/databases-block/model/types.ts';
import { DATABASES_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/databases-block/model/const.ts';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const DatabaseBox: FC<DatabasesBlockProps> = ({ index, remove }) => {
  const { t } = useTranslation(['clusters', 'shared']);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const togglePasswordVisibility = () => setIsPasswordHidden((prev) => !prev);

  const watchDbId = useWatch({
    name: `${DATABASES_BLOCK_FIELD_NAMES.DATABASES}.${index}.${DATABASES_BLOCK_FIELD_NAMES.BLOCK_ID}`,
  });

  const watchDbName = useWatch({
    name: `${DATABASES_BLOCK_FIELD_NAMES.DATABASES}.${index}.${DATABASES_BLOCK_FIELD_NAMES.DATABASE_NAME}`,
  });

  const watchNames = useWatch({ name: DATABASES_BLOCK_FIELD_NAMES.NAMES });

  useEffect(() => {
    // update names on change
    const newNames = { ...watchNames };
    newNames[watchDbId] = watchDbName;
    setValue(
      `${DATABASES_BLOCK_FIELD_NAMES.DATABASES}.${index}.${DATABASES_BLOCK_FIELD_NAMES.USER_NAME}`,
      `${watchDbName}-user`,
    );
    startTransition(() => setValue(DATABASES_BLOCK_FIELD_NAMES.NAMES, newNames));
  }, [watchDbName]);

  const deleteItem = () => {
    const newNames = { ...watchNames };
    delete newNames[watchDbId];
    setValue(DATABASES_BLOCK_FIELD_NAMES.NAMES, newNames);
    remove?.();
  };

  return (
    <Card sx={{ position: 'relative', padding: '16px', minWidth: '200px' }}>
      {remove ? (
        <IconButton sx={{ position: 'absolute', right: '4px', top: '4px', cursor: 'pointer' }} onClick={deleteItem}>
          <CloseIcon />
        </IconButton>
      ) : null}
      <Stack direction="column" gap={2}>
        <Typography fontWeight="bold">{`${t('database', { ns: 'clusters' })} ${index + 1}`}</Typography>
        <Stack direction="column" alignItems="flex-start" gap={2}>
          {[
            {
              fieldName: DATABASES_BLOCK_FIELD_NAMES.DATABASE_NAME,
              label: t('databaseName', { ns: 'clusters' }),
            },
            {
              fieldName: DATABASES_BLOCK_FIELD_NAMES.USER_NAME,
              label: t('username', { ns: 'shared' }),
            },
            {
              fieldName: DATABASES_BLOCK_FIELD_NAMES.USER_PASSWORD,
              label: t('userPassword', { ns: 'shared' }),
              isPassword: true,
            },
            {
              fieldName: DATABASES_BLOCK_FIELD_NAMES.ENCODING,
              label: t('encoding', { ns: 'clusters' }),
            },
            {
              fieldName: DATABASES_BLOCK_FIELD_NAMES.LOCALE,
              label: t('locale', { ns: 'shared' }),
            },
          ].map(({ fieldName, label, isPassword }) => (
            <Controller
              key={fieldName}
              control={control}
              name={`${DATABASES_BLOCK_FIELD_NAMES.DATABASES}.${index}.${fieldName}`}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  sx={{ width: '25ch' }}
                  label={label}
                  error={!!errors[DATABASES_BLOCK_FIELD_NAMES.DATABASES]?.[index]?.[fieldName]}
                  helperText={errors?.[DATABASES_BLOCK_FIELD_NAMES.DATABASES]?.[index]?.[fieldName]?.message as string}
                  {...(isPassword
                    ? {
                        type: isPasswordHidden ? 'password' : 'text',
                        slotProps: {
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label={isPasswordHidden ? 'display the password' : 'hide the password'}
                                  onClick={togglePasswordVisibility}
                                  edge="end">
                                  {isPasswordHidden ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        },
                      }
                    : {})}
                />
              )}
            />
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default DatabaseBox;
