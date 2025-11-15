import { FC } from 'react';
import { Stack } from '@mui/material';
import { ConnectionInfoRowContainerProps } from '@entities/cluster/connection-info/model/types.ts';

const ConnectionInfoRowContainer: FC<ConnectionInfoRowContainerProps> = ({ children }) => {
  return (
    <Stack direction="row" gap={1} alignItems="center" justifyContent="space-between">
      {children}
    </Stack>
  );
};

export default ConnectionInfoRowContainer;
