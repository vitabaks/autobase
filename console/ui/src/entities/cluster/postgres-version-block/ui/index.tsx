import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import { PostgresVersionBlockProps } from '@entities/cluster/postgres-version-block/model/types.ts';

const PostgresVersionBox: FC<PostgresVersionBlockProps> = ({ postgresVersions }) => {
  const { t } = useTranslation('clusters');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('postgresVersion')}
      </Typography>
      <Controller
        control={control}
        name={CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION}
        render={({ field: { value, onChange } }) => (
          <Select
            size="small"
            fullWidth
            value={value}
            onChange={onChange}
            renderValue={(selectedVersion) => String(selectedVersion)}
            error={!!errors[CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION]}
            helperText={errors[CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION]?.message}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: '200px' },
              },
            }}>
            {postgresVersions.map((version) => {
              const isEndOfLife =
                version.end_of_life && new Date(`${version.end_of_life}T00:00:00`).getTime() < today.getTime();
              const versionDetails = [
                version.release_date ? `Release: ${version.release_date}` : null,
                version.end_of_life ? `EOL: ${version.end_of_life}` : null,
              ]
                .filter(Boolean)
                .join(', ');

              return (
                <MenuItem
                  key={version?.major_version}
                  value={version?.major_version}
                  sx={isEndOfLife ? { color: 'error.main' } : undefined}>
                  {version?.major_version}
                  {versionDetails ? `\u00A0\u00A0(${versionDetails})` : ''}
                </MenuItem>
              );
            })}
          </Select>
        )}
      />
    </Box>
  );
};

export default PostgresVersionBox;
