import { BACKUPS_BLOCK_FIELD_NAMES } from '@entities/backups-block/model/const.ts';
import { Tooltip } from '@mui/material';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

export const renderIcon = () => {
  const { t } = useTranslation('shared');

  const {
    watch,
    formState: { errors },
  } = useFormContext();

  const watchConfigGlobal = watch(BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL);
  const watchConfigStanza = watch(BACKUPS_BLOCK_FIELD_NAMES.CONFIG_STANZA);

  const isGlobalConfigFilled = !!watchConfigGlobal;
  const isStanzaFilled = !!watchConfigStanza;

  const isGlobalConfigValid = !errors?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG_GLOBAL];
  const isStanzaValid = !errors?.[BACKUPS_BLOCK_FIELD_NAMES.CONFIG_STANZA];

  const renderIsValidMessage = (entity: string, isValid: boolean) => `${entity}: ${t(isValid ? 'valid' : 'invalid')}`;

  const renderValidIcon = ({ entity, isValid, isBothValid }) => {
    if (isBothValid)
      return (
        <Tooltip title={`${renderIsValidMessage('Global', true)}\n ${renderIsValidMessage('Stanza', true)}`}>
          <DoneAllOutlinedIcon />
        </Tooltip>
      );
    if (isBothValid === false)
      return (
        <Tooltip title={`${renderIsValidMessage('Global', false)}\n${renderIsValidMessage('Stanza', false)}`}>
          <DoNotDisturbAltOutlinedIcon />
        </Tooltip>
      );
    return (
      <Tooltip title={renderIsValidMessage(entity, isValid)}>
        {isValid ? <DoneOutlinedIcon /> : <DoNotDisturbAltOutlinedIcon />}
      </Tooltip>
    );
  };

  if (isGlobalConfigFilled && isGlobalConfigValid && isStanzaFilled && isStanzaValid)
    return renderValidIcon({ isBothValid: true });
  if (isGlobalConfigFilled && !isGlobalConfigValid && isStanzaFilled && !isStanzaValid)
    return renderValidIcon({ isBothValid: false });
  if (isGlobalConfigFilled && !isGlobalConfigValid)
    return (
      <>
        {renderValidIcon({
          entity: 'Global',
          isValid: false,
        })}
        {isStanzaFilled
          ? renderValidIcon({
              entity: 'Stanza',
              isValid: true,
            })
          : null}
      </>
    );
  if (isStanzaFilled && !isStanzaValid)
    return (
      <>
        {isGlobalConfigFilled
          ? renderValidIcon({
              entity: 'Global',
              isValid: true,
            })
          : null}
        {renderValidIcon({
          entity: 'Stanza',
          isValid: false,
        })}
      </>
    );
  if (isGlobalConfigFilled && isGlobalConfigValid)
    return renderValidIcon({
      entity: 'Global',
      isValid: true,
    });
  if (isStanzaFilled && isStanzaValid)
    return renderValidIcon({
      entity: 'Stanza',
      isValid: true,
    });
};
