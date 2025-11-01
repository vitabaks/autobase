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

  useEffect(() => {
    const volumes = watchProvider?.volumes;
    setStorage(volumes?.find((volume) => volume?.is_default) ?? {});

    setVolumeTypes(
      volumes?.map((volume) => ({
        label: volume?.volume_type,
        value: volume?.volume_type,
      })) ?? [],
    );

    setValue(
      // imperatively set a volume type when user changes provider
      STORAGE_BLOCK_FIELDS.VOLUME_TYPE,
      volumes?.find((volume) => volume?.is_default)?.volume_type ?? volumes?.[0]?.volume_type,
    );
  }, [watchProvider]);

  useEffect(() => {
    // set selected storage size sa minimum available for selected volume
    const volumes = watchProvider?.volumes;
    const storage = volumes?.find((volume) => volume?.volume_type === watchVolume);
    setStorage(storage);
    setValue(STORAGE_BLOCK_FIELDS.STORAGE_AMOUNT, storage?.min_size ?? 1);
  }, [watchVolume]);

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('dataDiskStorage')}
      </Typography>
      <Controller
        control={control}
        name={STORAGE_BLOCK_FIELDS.STORAGE_AMOUNT}
        render={({ field: { onChange, value } }) => (
          <ClusterSliderBox
            min={storage?.min_size ?? 1}
            max={storage?.max_size ?? 100}
            marksAdditionalLabel="GB"
            marksAmount={10}
            step={100}
            amount={value}
            changeAmount={onChange}
            unit="GB"
            limitMax
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
                        <FormControl fullWidth size="small">
                          <InputLabel>{label}</InputLabel>
                          <Select {...field} size="small" label={label}>
                            {options.map(({ value, label }) => (
                              <MenuItem key={value} value={value}>
                                <Tooltip
                                  title={
                                    watchProvider?.volumes?.find((volume) => volume?.volume_type === value)
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
        )}
      />
    </Box>
  );
};

export default StorageBlock;
