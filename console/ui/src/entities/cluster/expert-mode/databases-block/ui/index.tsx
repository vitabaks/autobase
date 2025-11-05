import { FC, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { DATABASES_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/databases-block/model/const.ts';
import DatabaseBox from '@entities/cluster/expert-mode/databases-block/ui/DatabaseBox.tsx';
import { uniqueId } from 'lodash';

const DatabaseBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const { control } = useFormContext();
  const [index, setIndex] = useState(2); // starts with 2 because 1 is reserved for an undeletable database

  const { fields, append, remove } = useFieldArray({
    control,
    name: DATABASES_BLOCK_FIELD_NAMES.DATABASES,
  });

  const appendItem = () => {
    append({
      [DATABASES_BLOCK_FIELD_NAMES.DATABASE_NAME]: `db${index}`,
      [DATABASES_BLOCK_FIELD_NAMES.USER_NAME]: 'user1',
      [DATABASES_BLOCK_FIELD_NAMES.USER_PASSWORD]: '',
      [DATABASES_BLOCK_FIELD_NAMES.ENCODING]: 'UTF-8',
      [DATABASES_BLOCK_FIELD_NAMES.LOCALE]: 'en_US.UTF-8',
      [DATABASES_BLOCK_FIELD_NAMES.BLOCK_ID]: uniqueId(),
    });
    setIndex((prev) => prev + 1);
  };

  const removeServer = (index: number) => () => remove(index);

  return (
    <Box>
      <Typography fontWeight="bold" marginBottom="8px">
        {t('databases')}
      </Typography>
      <Stack direction="column" gap="16px" justifyContent="center" alignItems="flex-start">
        <Box display="flex" gap="16px" flexWrap="wrap" justifyContent="flex-start" alignItems="center">
          {fields.map((field, index) => (
            <DatabaseBox
              key={field.id}
              index={index}
              {...(index !== 0 ? { remove: removeServer(index) } : {})} // removing entity such way is required to avoid bugs with a wrong element removed
            />
          ))}
        </Box>
        <Button onClick={appendItem}>
          <AddIcon />
        </Button>
      </Stack>
    </Box>
  );
};

export default DatabaseBlock;
