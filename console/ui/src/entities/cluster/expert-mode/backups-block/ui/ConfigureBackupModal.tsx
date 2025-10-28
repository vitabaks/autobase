import { FC, useState } from 'react';
import { Button, Card, Modal, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BACKUP_METHODS, BACKUPS_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/backups-block/model/const.ts';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';

const ConfigureBackupModal: FC = () => {
  const { t } = useTranslation(['clusters', 'shared']);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const handleModalOpenState = (isOpen: boolean) => () => setIsModalOpen(isOpen);

  const watchBackupMethod = useWatch({ name: BACKUPS_BLOCK_FIELD_NAMES.BACKUP_METHOD });
  const watchConfig = useWatch({ name: BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL });

  return (
    <>
      <Stack direction="row" alignItems="center" gap={1}>
        <Button onClick={handleModalOpenState(true)} variant="outlined">
          {t('configure')}
        </Button>
        {watchConfig ? (
          <Tooltip title={t(errors?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL] ? 'Invalid' : 'Valid')}>
            {errors?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL] ? <DoNotDisturbAltOutlinedIcon /> : <DoneOutlinedIcon />}
          </Tooltip>
        ) : null}
      </Stack>
      <Modal open={isModalOpen} onClose={handleModalOpenState(false)}>
        <Card
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            minWidth: '400px',
            height: 'max-content',
            bgcolor: 'background.paper',
            borderRadius: '3px',
            p: 4,
          }}>
          <Stack direction="column" gap="16px">
            <Typography fontWeight="bold" fontSize={20}>
              {t('configureBackup')}
            </Typography>
            {
              <Controller
                control={control}
                name={BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={20}
                    label={watchBackupMethod === BACKUP_METHODS.PG_BACK_REST ? t('global') : ''}
                    size="small"
                    error={!!errors?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL]}
                    helperText={errors?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL]?.message as string}
                  />
                )}
              />
            }
          </Stack>
        </Card>
      </Modal>
    </>
  );
};

export default ConfigureBackupModal;
