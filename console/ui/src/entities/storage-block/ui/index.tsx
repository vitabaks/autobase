import { FC } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Typography, useTheme } from '@mui/material';
import ClusterSliderBox from '@shared/ui/slider-box';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import StorageIcon from '@shared/assets/storageIcon.svg?react';
import { fileSystemTypeOptions, STORAGE_BLOCK_FIELDS } from '@entities/storage-block/model/const.ts';
import { IS_EXPERT_MODE } from '@shared/model/constants.ts';

const StorageBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const theme = useTheme();

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const watchProvider = watch(CLUSTER_FORM_FIELD_NAMES.PROVIDER);

  const storage = watchProvider?.volumes?.find((volume) => volume?.is_default) ?? {};

  const volumeTypes =
    watchProvider?.volumes?.map((volume) => ({
      label: volume?.volume_type,
      value: volume?.volume_type,
    })) ?? [];

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
                      options: volumeTypes as Record<string, string>[],
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
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {options.map(({ value, label }) => (
                              <MenuItem key={value} value={value}>
                                {label}
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
