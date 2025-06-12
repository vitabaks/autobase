import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { getAddSecretFormContentByType } from '@entities/secret-form-block/lib/functions.ts';
import { Link, Stack, Typography } from '@mui/material';
import { SecretFormBlockProps } from '@entities/secret-form-block/model/types.ts';

const SecretFormBlock: React.FC<SecretFormBlockProps> = ({ secretType, isAdditionalInfoDisplayed = false }) => {
  const { t } = useTranslation('settings');

  const content = getAddSecretFormContentByType(secretType);

  return (
    <Stack gap="16px" width="100%">
      <Typography variant="caption">
        {content.link ? (
          <Trans i18nKey={content.translationKey} t={t}>
            <Link href={content.link} color="text.secondary" target="_blank" />
          </Trans>
        ) : (
          t(content.translationKey)
        )}
      </Typography>
      <content.formComponent />
      {isAdditionalInfoDisplayed ? (
        <Typography variant="caption">{t('settingsConfidentialDataStore')}</Typography>
      ) : null}
    </Stack>
  );
};
export default SecretFormBlock;
