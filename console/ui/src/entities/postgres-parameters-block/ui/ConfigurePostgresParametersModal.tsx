import { FC, useState } from 'react';
import { Button, Card, Modal, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { POSTGRES_PARAMETERS_FIELD_NAMES } from '@entities/postgres-parameters-block/model/const.ts';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';

const ConfigurePostgresParametersModal: FC = () => {
  const { t } = useTranslation(['clusters', 'shared']);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const handleModalOpenState = (isOpen: boolean) => () => setIsModalOpen(isOpen);

  const watchPostgresParameters = watch(POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS);

  return (
    <>
      <Stack direction="row" alignItems="center" gap={1}>
        <Button onClick={handleModalOpenState(true)} variant="outlined">
          {t('configure')}
        </Button>
        {watchPostgresParameters ? (
          <Tooltip title={t(errors?.[POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS] ? 'Invalid' : 'Valid')}>
            {errors?.[POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS] ? (
              <DoNotDisturbAltOutlinedIcon />
            ) : (
              <DoneOutlinedIcon />
            )}
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
              {t('configurePostgresParameters')}
            </Typography>
            <Controller
              control={control}
              name={POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={20}
                  label={t('postgresParameters')}
                  size="small"
                  error={!!errors?.[POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS]}
                  helperText={errors?.[POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS]?.message as string}
                />
              )}
            />
          </Stack>
        </Card>
      </Modal>
    </>
  );
};

export default ConfigurePostgresParametersModal;
