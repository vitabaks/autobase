import { FC } from 'react';
import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import DatabaseServerBox from '@entities/database-servers-block/ui/DatabaseServerBox.tsx';
import { Checkbox, FormControlLabel, FormHelperText, Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';

const DatabaseServersBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const { control, watch } = useFormContext();

  const clusterExists = watch(CLUSTER_FORM_FIELD_NAMES.EXISTING_CLUSTER);

  const { fields, append, remove } = useFieldArray({
    control,
    name: CLUSTER_FORM_FIELD_NAMES.DATABASE_SERVERS,
  });

  const removeServer = (index: number) => () => remove(index);

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('databaseServers')}
      </Typography>

      <Controller
        name={CLUSTER_FORM_FIELD_NAMES.EXISTING_CLUSTER}
        control={control}
        defaultValue={false}
        render={({ field: { value, onChange } }) => (
          <FormControlLabel
            control={
              <Checkbox 
                checked={value}
                onChange={e => onChange(e.target.checked)}
              />
            }
            label={t('clusterExistsLabel')}
          />
        )}
      />
      <Typography variant="caption" color="textSecondary" gutterBottom>
        {t('clusterExistsHelp')}
      </Typography>

      <Stack direction="column" gap="16px" justifyContent="center" alignItems="flex-start">
        <Box display="flex" gap="16px" flexWrap="wrap" justifyContent="flex-start" alignItems="center">
          {fields.map((field, index) => (
            <DatabaseServerBox
              key={field.id}
              index={index}
              {...(index !== 0 ? { remove: removeServer(index) } : {})} // removing entity such way is required to avoid bugs with wrong element removed
            />
          ))}
        </Box>
        <Button onClick={append}>
          <AddIcon />
        </Button>
      </Stack>
    </Box>
  );
};

export default DatabaseServersBlock;
