import React, { FC, useState } from 'react';
import { Button, Card, CircularProgress, Modal, Stack, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddEntityFormValues, SettingsAddEntityProps } from '@shared/ui/settings-add-entity/model/types.ts';
import { AddEntityFormSchema } from '@shared/ui/settings-add-entity/model/validation.ts';
import { ADD_ENTITY_FORM_NAMES } from '@shared/ui/settings-add-entity/model/constants.ts';
import { handleRequestErrorCatch } from '@shared/lib/functions.ts';
import { useTranslation } from 'react-i18next';

const SettingsAddEntity: FC<SettingsAddEntityProps> = ({
  buttonLabel,
  headerLabel,
  submitButtonLabel,
  nameLabel,
  isLoading,
  submitTrigger,
}) => {
  const { t } = useTranslation(['settings', 'shared']);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpenState = (isOpen: boolean) => () => setIsModalOpen(isOpen);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AddEntityFormValues>({
    mode: 'all',
    resolver: yupResolver(AddEntityFormSchema(t)),
  });

  const onSubmit = async (values: AddEntityFormValues) => {
    try {
      await submitTrigger(values);
      setIsModalOpen(false);
    } catch (e) {
      handleRequestErrorCatch(e);
    }
  };

  return (
    <>
      <Button onClick={handleModalOpenState(true)} startIcon={<AddBoxOutlinedIcon />} variant="text">
        {buttonLabel ?? t('add', { ns: 'shared' })}
      </Button>
      <Modal open={isModalOpen} onClose={handleModalOpenState(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              height: 'max-content',
              bgcolor: 'background.paper',
              borderRadius: '3px',
              p: 4,
            }}>
            <Stack direction="column" gap="16px">
              <Typography fontWeight="bold" fontSize={20}>
                {headerLabel ?? t('add', { ns: 'shared' })}
              </Typography>
              <Stack direction="row" alignItems="center" gap="8px">
                <Controller
                  control={control}
                  name={ADD_ENTITY_FORM_NAMES.NAME}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      required
                      fullWidth
                      label={nameLabel ?? t('name', { ns: 'shared' })}
                      size="small"
                      value={value}
                      onChange={onChange}
                      error={!!errors?.[ADD_ENTITY_FORM_NAMES.NAME]}
                      helperText={errors?.[ADD_ENTITY_FORM_NAMES.NAME]?.message}
                    />
                  )}
                />
              </Stack>
              <Stack direction="row" alignItems="center" gap="8px">
                <Controller
                  control={control}
                  name={ADD_ENTITY_FORM_NAMES.DESCRIPTION}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      multiline
                      rows={6}
                      fullWidth
                      label={t('description', { ns: 'shared' })}
                      size="small"
                      value={value}
                      onChange={onChange}
                      error={!!errors?.[ADD_ENTITY_FORM_NAMES.DESCRIPTION]}
                      helperText={errors?.[ADD_ENTITY_FORM_NAMES.NAME]?.DESCRIPTION}
                    />
                  )}
                />
              </Stack>
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid || isSubmitting || isLoading}
                startIcon={isSubmitting || isLoading ? <CircularProgress size={16} /> : undefined}
              >
                {submitButtonLabel ?? t('add')}
              </Button>
            </Stack>
          </Card>
        </form>
      </Modal>
    </>
  );
};

export default SettingsAddEntity;
