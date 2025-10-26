import { FC } from 'react';
import { Box, Link, Stack, Typography } from '@mui/material';
import { ExtensionBoxProps } from '@entities/cluster/expert-mode/extensions-block/model/types.ts';
import ExtensionSelector from '@entities/cluster/expert-mode/extensions-block/ui/ExtensionSelector.tsx';

const ExtensionBox: FC<ExtensionBoxProps> = ({ extension }) => (
  <Box border="1px solid #E0E0E0" height={120} alignItems="center" p={1}>
    {extension?.image ? <img src={extension.image} width="48px" alt={'img'} /> : <Box />}
    <Stack direction="column">
      <Typography fontWeight="bold">
        {extension?.url ? (
          <Link target="_blank" href={extension.url} color="#000">
            <u>{extension.name}</u>
          </Link>
        ) : (
          extension.name
        )}
      </Typography>
      <Typography>{extension.description}</Typography>
    </Stack>
    <ExtensionSelector extension={extension} />
  </Box>
);

export default ExtensionBox;
