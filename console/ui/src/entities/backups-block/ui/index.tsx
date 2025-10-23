import { FC } from 'react';
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { BACKUP_METHODS, BACKUPS_BLOCK_FIELD_NAMES } from '@entities/backups-block/model/const.ts';
import { range } from '@mui/x-data-grid/internals';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ConfigureBackupModal from '@entities/backups-block/ui/ConfigureBackupModal.tsx';

const BackupsBlock: FC = () => {
  const { t } = useTranslation('clusters');

  const { control, watch, resetField } = useFormContext();

  const watchIsBackupsEnabled = watch(BACKUPS_BLOCK_FIELD_NAMES.IS_BACKUPS_ENABLED);

  return (
    <Stack>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('backups')}
      </Typography>
      <Stack direction="column" spacing={1} alignItems="flex-start">
        <Controller
          control={control}
          name={BACKUPS_BLOCK_FIELD_NAMES.IS_BACKUPS_ENABLED}
          render={({ field }) => (
            <FormControlLabel
              {...field}
              checked={!!field.value}
              control={<Checkbox />}
              sx={{
                '& .MuiFormControlLabel-label': {
                  width: '250px',
                },
                marginLeft: 0,
              }}
              labelPlacement="start"
              label={t('backups')}
            />
          )}
        />
        {watchIsBackupsEnabled ? (
          <>
            <Controller
              control={control}
              name={BACKUPS_BLOCK_FIELD_NAMES.BACKUP_METHOD}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <RadioGroup
                      {...field}
                      row
                      onChange={(e) => {
                        if (field.value === BACKUP_METHODS.PG_BACK_REST) {
                          resetField(BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL);
                          resetField(BACKUPS_BLOCK_FIELD_NAMES.CONFIG_STANZA);
                        } else resetField(BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL);
                        field.onChange(e);
                      }}>
                      {[
                        { label: 'pgBackRest', value: BACKUP_METHODS.PG_BACK_REST },
                        { label: 'WAL-G', value: BACKUP_METHODS.WAL_G },
                      ].map(({ label, value }) => (
                        <FormControlLabel
                          key={value}
                          value={value}
                          label={label}
                          control={<Radio />}
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              width: 'fit-content !important',
                            },
                            marginLeft: 0,
                          }}
                          labelPlacement="end"
                        />
                      ))}
                    </RadioGroup>
                  }
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      width: '250px',
                    },
                    marginLeft: 0,
                  }}
                  labelPlacement="start"
                  label={t('backupMethod')}
                />
              )}
            />
            <Controller
              control={control}
              name={BACKUPS_BLOCK_FIELD_NAMES.BACKUP_START_TIME}
              render={({ field }) => (
                <Stack direction="row" alignItems="center">
                  <Typography width="250px">{t('backupStartTime')}</Typography>
                  <Select {...field} size="small" label={t('backupStartTime')}>
                    {range(0, 24).map((value) => (
                      <MenuItem key={value} value={value}>
                        {`${value}:00`}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              )}
            />
            <Controller
              control={control}
              name={BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION}
              render={({ field }) => (
                <Stack direction="row" alignItems="center">
                  <Stack width="250px" direction="row" alignItems="center" gap={0.5}>
                    <Typography>{t('backupRetention')}</Typography>
                    <Tooltip title={t('backupRetentionTooltip')}>
                      <HelpOutlineIcon fontSize="small" />
                    </Tooltip>
                  </Stack>
                  <Stack>
                    <TextField {...field} size="small" />
                    <Slider {...field} step={1} min={0} max={365} sx={{ paddingTop: 0, marginTop: '-8px' }} />
                  </Stack>
                </Stack>
              )}
            />
            <ConfigureBackupModal />
          </>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default BackupsBlock;
