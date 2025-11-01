import { FC } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import DatabaseServerBox from '@entities/cluster/database-servers-block/ui/DatabaseServerBox.tsx';
import { Box, Button, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { DATABASE_SERVERS_FIELD_NAMES } from '@entities/cluster/database-servers-block/model/const.ts';

const DatabaseServersBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: DATABASE_SERVERS_FIELD_NAMES.DATABASE_SERVERS,
  });

  const removeServer = (index: number) => () => remove(index);

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('databaseServers')}
      </Typography>
      <Controller
        name={DATABASE_SERVERS_FIELD_NAMES.IS_CLUSTER_EXISTS}
        control={control}
        defaultValue={false}
        render={({ field: { value, onChange } }) => (
          <FormControlLabel
            control={<Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} />}
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
              {...(index !== 0 ? { remove: removeServer(index) } : {})} // removing entity such way is required to avoid bugs with a wrong element removed
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
