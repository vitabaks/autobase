import { FC, useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useGetOperationsByIdLogQuery } from '@shared/api/api/operations.ts';
import { useParams } from 'react-router-dom';
import { LazyLog } from 'react-lazylog';
import { useQueryPolling } from '@shared/lib/hooks.tsx';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectPollingInterval } from '@app/redux/slices/pollingIntervalSlice/pollingIntervalSlice.ts';
import RefreshIntervalSelect from '@features/refresh-interval-select';

const OperationLog: FC = () => {
  const { operationId } = useParams();
  const [isStopRequest, setIsStopRequest] = useState(false);
  const pollingInterval = useAppSelector(selectPollingInterval('operationLogs'));

  const log = useQueryPolling(
    () => useGetOperationsByIdLogQuery({ id: operationId }),
    pollingInterval,
    { stop: isStopRequest },
  );

  useEffect(() => {
    setIsStopRequest(!!log.data?.isComplete);
  }, [log.data?.isComplete]);

  return (
    <Box width="100%" height="85vh">
      <Stack direction="row" justifyContent="flex-end" alignItems="center" gap="8px" pb={1}>
        <RefreshIntervalSelect context="operationLogs" />
      </Stack>
      <LazyLog
        follow
        scrollToAlignment="end"
        text={log.data?.log ?? '\t'}
        extraLines={1}
        overscanRowCount={10}
        caseInsensitive
        selectableLines
        enableSearch
      />
    </Box>
  );
};

export default OperationLog;
