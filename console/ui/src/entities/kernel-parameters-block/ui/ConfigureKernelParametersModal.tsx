import { FC, useState } from 'react';
import { Button, Card, Modal, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KERNEL_PARAMETERS_FIELD_NAMES } from '@entities/kernel-parameters-block/model/const.ts';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';

const ConfigureKernelParametersModal: FC = () => {
  const { t } = useTranslation('clusters');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const handleModalOpenState = (isOpen: boolean) => () => setIsModalOpen(isOpen);

  const watchKernelParameters = watch(KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS);

  return (
    <>
      <Stack direction="row" alignItems="center" gap={1}>
        <Button onClick={handleModalOpenState(true)} variant="outlined">
          {t('configure')}
        </Button>
        {watchKernelParameters ? (
          <Tooltip title={t(!!errors?.[KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS] ? 'Invalid' : 'Valid')}>
            {!!errors?.[KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS] ? (
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
              {t('configureKernelParameters')}
            </Typography>
            <Controller
              control={control}
              name={KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={20}
                  label={t('kernelParameters')}
                  size="small"
                  error={!!errors?.[KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS]}
                  helperText={errors?.[KERNEL_PARAMETERS_FIELD_NAMES.KERNEL_PARAMETERS]?.message as string}
                />
              )}
            />
          </Stack>
        </Card>
      </Modal>
    </>
  );
};

export default ConfigureKernelParametersModal;
