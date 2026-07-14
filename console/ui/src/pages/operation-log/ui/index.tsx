import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useGetOperationsByIdLogQuery } from '@shared/api/api/operations.ts';
import { useParams } from 'react-router-dom';
import { LazyLog } from 'react-lazylog';
import { useQueryPolling } from '@shared/lib/hooks.tsx';

const OPERATION_LOG_POLLING_INTERVAL = 5_000;

const OperationLog: FC = () => {
  const { operationId } = useParams();
  const [isStopRequest, setIsStopRequest] = useState(false);
  const logRequest = useGetOperationsByIdLogQuery({ id: operationId });
  const log = useQueryPolling(logRequest, OPERATION_LOG_POLLING_INTERVAL, { stop: isStopRequest });

  useEffect(() => {
    setIsStopRequest(!!log.data?.isComplete);
  }, [log.data?.isComplete]);

  return (
    <Box width="100%" height="85vh">
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
