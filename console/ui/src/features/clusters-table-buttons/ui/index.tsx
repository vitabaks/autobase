import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { generateAbsoluteRouterPath } from '@shared/lib/functions.ts';
import RouterPaths from '@app/router/routerPathsConfig';
import AddIcon from '@mui/icons-material/Add';
import { ClustersTableButtonsProps } from '@features/clusters-table-buttons/model/types.ts';
import RefreshGroup from '@features/refresh-group';
import { FC } from 'react';

const ClustersTableButtons: FC<ClustersTableButtonsProps> = ({ refetch }) => {
  const { t } = useTranslation(['clusters, shared']);
  const navigate = useNavigate();

  const handleCreateCluster = () => {
    navigate(generateAbsoluteRouterPath(RouterPaths.clusters.add.absolutePath));
  };

  return (
    <Stack direction="row" justifyContent="flex-end" alignItems="center" gap="8px">
      <Button onClick={handleCreateCluster} startIcon={<AddIcon />} variant="text">
        {t('createCluster', { ns: 'clusters' })}
      </Button>
      <RefreshGroup context="clusters" onRefresh={refetch} />
    </Stack>
  );
};

export default ClustersTableButtons;
