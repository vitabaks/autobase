import { FC } from 'react';
import SelectableBox from '@shared/ui/selectable-box';
import { Box, Typography, useTheme } from '@mui/material';
import FlagsIcon from '@assets/flagIcon.svg?react';
import { ClusterFormRegionConfigBoxProps } from '@widgets/cluster-form/model/types.ts';

const ClusterFormRegionConfigBox: FC<ClusterFormRegionConfigBoxProps> = ({ name, place, isActive, ...props }) => {
  const theme = useTheme();

  return (
    <SelectableBox sx={{ padding: '8px' }} isActive={isActive} {...props}>
      <Box marginBottom="8px">
        <Typography>{name}</Typography>
      </Box>
      <Box display="flex">
        <FlagsIcon width="24px" height="25px" style={{ fill: theme.palette.text.primary }} />
        &nbsp;
        <Typography>{place}</Typography>
      </Box>
    </SelectableBox>
  );
};

export default ClusterFormRegionConfigBox;
