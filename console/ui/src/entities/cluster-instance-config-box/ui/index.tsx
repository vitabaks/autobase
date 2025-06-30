import { FC } from 'react';
import { ClusterFromInstanceConfigBoxProps } from '@entities/cluster-instance-config-box/model/types.ts';
import SelectableBox from '@shared/ui/selectable-box';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import RamIcon from '@shared/assets/ramIcon.svg?react';
import CpuIcon from '@shared/assets/cpuIcon.svg?react';

const ClusterFromInstanceConfigBox: FC<ClusterFromInstanceConfigBoxProps> = ({
  name,
  cpu,
  ram,
  isActive,
  ...props
}) => {
  const theme = useTheme();

  return (
    <SelectableBox sx={{ padding: '8px' }} isActive={isActive} {...props}>
      <Box marginBottom="8px">
        <Typography>{name}</Typography>
      </Box>
      <Stack direction="row" spacing={2} alignItems="center">
        <Stack direction="row" spacing={0.5} alignItems="center">
          <CpuIcon width="24px" height="24px" style={{ fill: theme.palette.text.primary }} />
          <Typography>{cpu}&nbsp;CPU</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <RamIcon width="24px" height="24px" style={{ fill: theme.palette.text.primary }} />
          <Typography>{ram} GB RAM</Typography>
        </Stack>
      </Stack>
    </SelectableBox>
  );
};

export default ClusterFromInstanceConfigBox;
