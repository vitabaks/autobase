import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Box, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Popover, Select, Switch } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { DATABASES_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/databases-block/model/const.ts';
import { useTranslation } from 'react-i18next';
import { EXTENSION_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/extensions-block/model/const.ts';
import { ExtensionSelectorProps } from '@entities/cluster/expert-mode/extensions-block/model/types.ts';
import { intersection } from 'lodash';

const ExtensionSelector: FC<ExtensionSelectorProps> = ({ extension }) => {
  const { t } = useTranslation('clusters');
  const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const { control, setValue } = useFormContext();

  const watchAvailableNames = useWatch({ name: DATABASES_BLOCK_FIELD_NAMES.NAMES });
  const watchSelectedExtensions = useWatch({ name: EXTENSION_BLOCK_FIELD_NAMES.EXTENSIONS });

  const handleSwitchClick = (e: ChangeEvent<HTMLInputElement>) => {
    // open Popper on click
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (onChange) => (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(!!e.target.value?.length);
    onChange(e);
  };

  useEffect(() => {
    const intersected = intersection(
      watchSelectedExtensions?.[extension.name] ?? [],
      watchAvailableNames ? Object.keys(watchAvailableNames).slice(1) : [], // slice is a workaround to remove duplicated first db name
    ); // remove db from selected if db removed
    setValue(`${EXTENSION_BLOCK_FIELD_NAMES.EXTENSIONS}.${extension.name}`, intersected);
    intersected?.length ? setIsChecked(true) : setIsChecked(false);
  }, [watchAvailableNames]);

  return (
    <Box>
      <div onClick={handleSwitchClick}>
        <Switch checked={isChecked} sx={{ position: 'absolute', right: 0, top: 0 }} />
      </div>
      <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={handleClose}>
        <Box bgcolor="#fff" padding={1} width={200}>
          <FormControl fullWidth>
            <InputLabel size="small">{t('databases')}</InputLabel>
            <Controller
              control={control}
              name={`${EXTENSION_BLOCK_FIELD_NAMES.EXTENSIONS}.${extension.name}`}
              render={({ field: { value, onChange } }) => (
                <Select
                  defaultOpen
                  onClose={handleClose} // close Popover too when closing Select
                  fullWidth
                  multiple
                  renderValue={(selected) => selected.map((value) => watchAvailableNames[value]).join(', ')}
                  label={t('databases')}
                  onChange={handleChange(onChange)}
                  value={value ?? []}
                  MenuProps={{
                    sx: {
                      height: '300px',
                    },
                  }}>
                  {watchAvailableNames
                    ? Object.entries(watchAvailableNames)
                        .slice(1) // workaround to remove duplicated first db name
                        .map((db) => (
                          <MenuItem key={db[0]} value={db[0]}>
                            <Checkbox checked={value?.includes(db[0]) ?? false} />
                            <ListItemText primary={db[1]} />
                          </MenuItem>
                        ))
                    : null}
                </Select>
              )}
            />
          </FormControl>
        </Box>
      </Popover>
    </Box>
  );
};

export default ExtensionSelector;
