import { FC, useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import ClusterSliderBox from '@shared/ui/slider-box';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import StorageIcon from '@assets/storageIcon.svg?react';
import { fileSystemTypeOptions, STORAGE_BLOCK_FIELDS } from '@entities/cluster/storage-block/model/const.ts';
import { IS_EXPERT_MODE } from '@shared/model/constants.ts';

const StorageBlock: FC = () => {
  const LOCAL_VOLUME_TYPE = 'local';
  const { t } = useTranslation(['clusters', 'shared']);
  const theme = useTheme();
  const [storage, setStorage] = useState({}); // full info about selected storage
  const [volumeTypes, setVolumeTypes] = useState([]);

  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const watchProvider = useWatch({ name: CLUSTER_FORM_FIELD_NAMES.PROVIDER });
  const watchVolume = useWatch({ name: STORAGE_BLOCK_FIELDS.VOLUME_TYPE });
  const isSystemDisk = watchVolume === LOCAL_VOLUME_TYPE;

  useEffect(() => {
    const volumes = watchProvider?.volumes;
    const defaultVolume = volumes?.find((volume) => volume?.is_default) ?? volumes?.[0];
    setStorage(defaultVolume ?? {});
    setValue(STORAGE_BLOCK_FIELDS.STORAGE_AMOUNT, defaultVolume?.min_size ?? 1);

    setVolumeTypes(
      [
        ...(volumes?.map((volume) => ({ label: volume?.volume_type, value: volume?.volume_type })) ?? []),
        { label: t('localDisk'), value: LOCAL_VOLUME_TYPE },
      ],
    );

    setValue(
      // imperatively set a volume type when user changes provider
      STORAGE_BLOCK_FIELDS.VOLUME_TYPE,
      defaultVolume?.volume_type,
    );
  }, [setValue, t, watchProvider?.volumes]);

  useEffect(() => {
    if (watchVolume === LOCAL_VOLUME_TYPE) {
      setValue(STORAGE_BLOCK_FIELDS.STORAGE_AMOUNT, 0);
      return;
    }

    // Update the slider bounds for the selected volume. The size itself is set
    // by the volume-type control, so manually typed values are not overwritten.
    const volumes = watchProvider?.volumes;
    const storage = volumes?.find((volume) => volume?.volume_type === watchVolume);
    setStorage(storage);
  }, [setValue, watchProvider?.volumes, watchVolume]);

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('dataDiskStorage')}
      </Typography>
      <Controller
        control={control}
        name={STORAGE_BLOCK_FIELDS.STORAGE_AMOUNT}
        render={({ field: { onChange, value } }) => {
          const handleStorageChange = (amount: number) => {
            onChange(amount);

            if (amount === 0) {
              setValue(STORAGE_BLOCK_FIELDS.VOLUME_TYPE, LOCAL_VOLUME_TYPE);
            } else if (watchVolume === LOCAL_VOLUME_TYPE && amount >= (storage?.min_size ?? 1)) {
              const defaultVolume = watchProvider?.volumes?.find((volume) => volume?.is_default) ?? watchProvider?.volumes?.[0];
              setValue(STORAGE_BLOCK_FIELDS.VOLUME_TYPE, defaultVolume?.volume_type);
            }
          };

          return (
          <ClusterSliderBox
            min={storage?.min_size ?? 1}
            max={storage?.max_size ?? 100}
            marksAdditionalLabel="GB"
            marksAmount={10}
            amount={value}
            changeAmount={handleStorageChange}
            unit="GB"
            limitMax
            allowZero
            icon={<StorageIcon width="24px" height="24px" style={{ fill: theme.palette.text.primary }} />}
            error={errors[STORAGE_BLOCK_FIELDS.STORAGE_AMOUNT]}
            topRightElements={
              IS_EXPERT_MODE ? (
                <Stack direction="row" minWidth="350px" spacing={1}>
                  {[
                    {
                      fieldName: STORAGE_BLOCK_FIELDS.FILE_SYSTEM_TYPE,
                      label: t('fileSystemType'),
                      options: fileSystemTypeOptions,
                    },
                    {
                      fieldName: STORAGE_BLOCK_FIELDS.VOLUME_TYPE,
                      label: t('volumeType'),
                      options: volumeTypes,
                    },
                  ].map(({ fieldName, label, options }) => (
                    <Controller
                      key={fieldName}
                      control={control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          size="small"
                          sx={
                            isSystemDisk && fieldName === STORAGE_BLOCK_FIELDS.FILE_SYSTEM_TYPE
                              ? { visibility: 'hidden' }
                              : undefined
                          }>
                          <InputLabel>{label}</InputLabel>
                          <Select
                            {...field}
                            size="small"
                            label={label}
                            onChange={(event) => {
                              field.onChange(event);
                              if (fieldName === STORAGE_BLOCK_FIELDS.VOLUME_TYPE) {
                                const selectedVolume = watchProvider?.volumes?.find(
                                  (volume) => volume?.volume_type === event.target.value,
                                );
                                setValue(STORAGE_BLOCK_FIELDS.STORAGE_AMOUNT, selectedVolume?.min_size ?? 0);
                              }
                            }}>
                            {options.map(({ value, label }) => (
                              <MenuItem key={value} value={value}>
                                <Tooltip
                                  title={
                                    value === LOCAL_VOLUME_TYPE
                                      ? t('localDiskDescription')
                                      : watchProvider?.volumes?.find((volume) => volume?.volume_type === value)
                                          ?.volume_description ?? ''
                                  }>
                                  {label}
                                </Tooltip>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  ))}
                </Stack>
              ) : null
            }
          />
          );
        }}
      />
    </Box>
  );
};

export default StorageBlock;
