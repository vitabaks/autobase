import { ChangeEvent, FC, useEffect } from 'react';
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
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { BACKUP_METHODS, BACKUPS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/backups-block/model/const.ts';
import { range } from '@mui/x-data-grid/internals';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ConfigureBackupModal from '@entities/cluster/expert-mode/backups-block/ui/ConfigureBackupModal.tsx';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PROVIDERS } from '@shared/config/constants.ts';

const BackupsBlock: FC = () => {
  const { t } = useTranslation('clusters');

  const {
    control,
    resetField,
    setValue,
    formState: { errors },
  } = useFormContext();

  const watchIsBackupsEnabled = useWatch({ name: BACKUPS_BLOCK_FIELD_NAMES.IS_BACKUPS_ENABLED });
  const watchProvider = useWatch({ name: CLUSTER_FORM_FIELD_NAMES.PROVIDER });

  const handleInputChange = (onChange: (event: ChangeEvent) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    // prevent user from entering less than restricted amount in input field
    const { value } = e.target;
    if (value < 0) {
      e.target.value = 0;
    }
    onChange(e);
  };

  useEffect(() => {
    if (watchProvider?.code === PROVIDERS.LOCAL) setValue(BACKUPS_BLOCK_FIELD_NAMES.IS_BACKUPS_ENABLED, true);
  }, [watchProvider]);

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
            <Stack direction="row" alignItems="center">
              <Stack direction="row" alignItems="center" width={250}>
                <Typography>{t('backupsEnabled')}</Typography>
              </Stack>
              <Checkbox {...field} checked={!!field.value} />
            </Stack>
          )}
        />
        {watchIsBackupsEnabled ? (
          <>
            <Controller
              control={control}
              name={BACKUPS_BLOCK_FIELD_NAMES.BACKUP_METHOD}
              render={({ field }) => (
                <Stack direction="row" alignItems="center">
                  <Stack direction="row" alignItems="center" width={250}>
                    <Typography>{t('backupMethod')}</Typography>
                  </Stack>
                  <RadioGroup
                    {...field}
                    row
                    onChange={(e) => {
                      resetField(BACKUPS_BLOCK_FIELD_NAMES.CONFIG);
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
                </Stack>
              )}
            />
            <Controller
              control={control}
              name={BACKUPS_BLOCK_FIELD_NAMES.BACKUP_START_TIME}
              render={({ field }) => (
                <Stack direction="row" alignItems="center">
                  <Typography width="250px">{t('backupStartTime')}</Typography>
                  <Select
                    {...field}
                    size="small"
                    MenuProps={{
                      sx: {
                        height: '300px',
                      },
                    }}
                    sx={{
                      '& .MuiMenu-list': {
                        height: '50px',
                      },
                    }}>
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
                    <TextField
                      {...field}
                      onChange={handleInputChange(field.onChange)}
                      size="small"
                      error={!!errors?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION]}
                      helperText={errors?.[BACKUPS_BLOCK_FIELD_NAMES.BACKUP_RETENTION]?.message as string}
                    />
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
