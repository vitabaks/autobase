import { FC, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ClustersTableRemoveButtonProps } from '@features/clusters-table-row-actions/model/types.ts';
import { useDeleteClustersByIdMutation } from '@shared/api/api/clusters.ts';
import { toast } from 'react-toastify';
import { handleRequestErrorCatch } from '@shared/lib/functions.ts';

const ClustersTableRemoveButton: FC<ClustersTableRemoveButtonProps> = ({ clusterId, clusterName, closeMenu }) => {
  const { t } = useTranslation(['clusters', 'shared']);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [removeClusterTrigger, removeClusterTriggerState] = useDeleteClustersByIdMutation();

  const handleModalOpenState = (state: boolean) => () => {
    setIsModalOpen(state);
    if (!state) closeMenu();
  };

  const handleButtonClick = async () => {
    try {
      await removeClusterTrigger({ id: clusterId });
      closeMenu();
      toast.success(t('clusterSuccessfullyRemoved', { ns: 'toasts', clusterName }));
    } catch (e) {
      handleRequestErrorCatch(e);
    }
  };

  return (
    <>
      <Button sx={{ textTransform: 'none', color: 'text.primary' }} onClick={handleModalOpenState(true)} variant="text">
        <Stack direction="row" alignItems="center" justifyContent="flex-start" width="max-content">
          <DeleteOutlineIcon />
          <Typography>{t('removeFromList', { ns: 'shared' })}</Typography>
        </Stack>
      </Button>
      <Dialog open={isModalOpen} onClose={handleModalOpenState(false)}>
        <DialogTitle> {t('deleteClusterModalHeader', { ns: 'clusters', clusterName })}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('deleteClusterModalBody', { ns: 'clusters', clusterName })}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalOpenState(false)}>{t('cancel', { ns: 'shared' })}</Button>
          <Button
            type="submit"
            onClick={handleButtonClick}
            disabled={removeClusterTriggerState.isLoading}
            startIcon={removeClusterTriggerState.isLoading ? <CircularProgress size={16} /> : undefined}
          >
            {t('delete', { ns: 'shared' })}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClustersTableRemoveButton;
