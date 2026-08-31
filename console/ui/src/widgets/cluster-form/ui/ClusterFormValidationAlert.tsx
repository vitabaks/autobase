import { FC } from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getClusterFormValidationErrors } from '@widgets/cluster-form/model/validationErrors.ts';

const ClusterFormValidationAlert: FC = () => {
  const { t } = useTranslation(['clusters', 'shared', 'settings']);
  const {
    formState: { errors },
  } = useFormContext();
  const validationErrors = getClusterFormValidationErrors(errors, t);

  if (!validationErrors.length) return null;

  return (
    <Alert severity="warning">
      <AlertTitle>{t('fieldsToComplete')}</AlertTitle>
      <ul style={{ margin: 0, paddingLeft: '20px' }}>
        {validationErrors.map(({ path, label, message }) => (
          <li key={path}>
            <strong>{label}:</strong> {message}
          </li>
        ))}
      </ul>
    </Alert>
  );
};

export default ClusterFormValidationAlert;
