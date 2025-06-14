import { FC } from 'react';
import { CopyIconProps } from '@shared/ui/copy-icon/model/types.ts';
import { useCopyToClipboard } from '@shared/lib/hooks.tsx';
import CopyValueIcon from '@mui/icons-material/ContentCopyOutlined';
import { Box, SxProps, Theme } from '@mui/material';

const CopyIcon: FC<CopyIconProps & { sx?: SxProps<Theme> }> = ({ valueToCopy, sx }) => {
  const [_, copyFunction] = useCopyToClipboard();

  return (
    <Box onClick={() => copyFunction(valueToCopy)} sx={{ cursor: 'pointer', ...sx }}>
      <CopyValueIcon sx={{ fontSize: 'inherit' }} />
    </Box>
  );
};

export default CopyIcon;
