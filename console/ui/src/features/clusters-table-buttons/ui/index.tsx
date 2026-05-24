import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { generateAbsoluteRouterPath } from '@shared/lib/functions.ts';
import RouterPaths from '@app/router/routerPathsConfig';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { ClustersTableButtonsProps } from '@features/clusters-table-buttons/model/types.ts';
import RefreshIntervalSelect from '@features/refresh-interval-select';
import { FC } from 'react';

const ClustersTableButtons: FC<ClustersTableButtonsProps> = ({ refetch }) => {
  const { t } = useTranslation(['clusters, shared']);
  const navigate = useNavigate();

  const handleRefresh = () => {
    refetch();
  };

  const handleCreateCluster = () => {
    navigate(generateAbsoluteRouterPath(RouterPaths.clusters.add.absolutePath));
  };

  return (
    <Stack direction="row" justifyContent="flex-end" alignItems="center" gap="8px">
      <RefreshIntervalSelect context="clusters" />
      <Button onClick={handleRefresh} startIcon={<RefreshIcon />} variant="text">
        {t('refresh', { ns: 'shared' })}
      </Button>
      <Button onClick={handleCreateCluster} startIcon={<AddIcon />} variant="text">
        {t('createCluster', { ns: 'clusters' })}
      </Button>
    </Stack>
  );
};

export default ClustersTableButtons;
