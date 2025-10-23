import { FC, useState } from 'react';
import { Button, Card, Modal, Stack, TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BACKUP_METHODS, BACKUPS_BLOCK_FIELD_NAMES } from '@entities/backups-block/model/const.ts';
import { renderIcon } from '@entities/backups-block/lib/functions.tsx';

const ConfigureBackupModal: FC = () => {
  const { t } = useTranslation(['clusters', 'shared']);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const handleModalOpenState = (isOpen: boolean) => () => setIsModalOpen(isOpen);

  const watchBackupMethod = watch(BACKUPS_BLOCK_FIELD_NAMES.BACKUP_METHOD);

  return (
    <>
      <Stack direction="row" alignItems="center" gap={1}>
        <Button onClick={handleModalOpenState(true)} variant="outlined">
          {t('configure')}
        </Button>
        {renderIcon()}
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
            {watchBackupMethod === BACKUP_METHODS.PG_BACK_REST ? (
              <Stack gap="8px">
                {[
                  {
                    fieldName: BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL,
                    label: t('global'),
                  },
                  { fieldName: BACKUPS_BLOCK_FIELD_NAMES.CONFIG_STANZA, label: 'Stanza' },
                ].map(({ fieldName, label }) => (
                  <Controller
                    key={fieldName}
                    control={control}
                    name={fieldName}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={20}
                        label={label}
                        size="small"
                        error={!!errors?.[fieldName]}
                        helperText={errors?.[fieldName]?.message as string}
                      />
                    )}
                  />
                ))}
              </Stack>
            ) : (
              <Controller
                control={control}
                name={BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={20}
                    label={t('global')}
                    size="small"
                    error={!!errors?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL]}
                    helperText={errors?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL]?.message as string}
                  />
                )}
              />
            )}
          </Stack>
        </Card>
      </Modal>
    </>
  );
};

export default ConfigureBackupModal;
