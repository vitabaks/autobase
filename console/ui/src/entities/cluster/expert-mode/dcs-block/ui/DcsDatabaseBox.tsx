import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Card, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { DcsDatabaseBoxProps } from '@entities/cluster/expert-mode/dcs-block/model/types.ts';
import { DCS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/dcs-block/model/const.ts';

const DcsDatabaseBox: FC<DcsDatabaseBoxProps> = ({ index, remove }) => {
  const { t } = useTranslation('clusters');
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Card sx={{ position: 'relative', padding: '16px', minWidth: '200px' }}>
      {remove ? (
        <IconButton sx={{ position: 'absolute', right: '4px', top: '4px', cursor: 'pointer' }} onClick={remove}>
          <CloseIcon />
        </IconButton>
      ) : null}
      <Stack direction="column" gap={1}>
        <Typography fontWeight="bold">{`${t('server')} ${index + 1}`}</Typography>
        {[
          {
            fieldName: DCS_BLOCK_FIELD_NAMES.DATABASE_HOSTNAME,
            label: t('hostname'),
          },
          {
            fieldName: DCS_BLOCK_FIELD_NAMES.IP_ADDRESS,
            label: t('ipAddress'),
          },
          { fieldName: DCS_BLOCK_FIELD_NAMES.DATABASE_PORT, label: t('port') },
        ].map(({ fieldName, label }) => (
          <Controller
            key={fieldName}
            control={control}
            name={`${DCS_BLOCK_FIELD_NAMES.DATABASES}.${index}.${fieldName}`}
            render={({ field }) => (
              <TextField
                {...field}
                required
                size="small"
                label={label}
                error={!!errors[DCS_BLOCK_FIELD_NAMES.DATABASES]?.[index]?.[fieldName]}
                helperText={errors?.[DCS_BLOCK_FIELD_NAMES.DATABASES]?.[index]?.[fieldName]?.message ?? ' '}
              />
            )}
          />
        ))}
      </Stack>
    </Card>
  );
};

export default DcsDatabaseBox;
