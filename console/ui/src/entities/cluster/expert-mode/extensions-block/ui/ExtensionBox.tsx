import { FC } from 'react';
import { Link, Stack, Tooltip, Typography } from '@mui/material';
import { ExtensionBoxProps } from '@entities/cluster/expert-mode/extensions-block/model/types.ts';
import ExtensionSelector from '@entities/cluster/expert-mode/extensions-block/ui/ExtensionSelector.tsx';

const ExtensionBox: FC<ExtensionBoxProps> = ({ extension, extensionIcons }) => (
  <Stack border="1px solid #E0E0E0" direction="row" height={120} p={1} gap={1}>
    {extension?.image ? (
      <Stack alignItems="center" justifyContent="center">
        <img src={extensionIcons[extension?.image]} width="48px" height="48x" alt="img" />
      </Stack>
    ) : null}
    <Stack direction="column">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontWeight="bold">
          {extension?.url ? (
            <Link target="_blank" href={extension.url} color="#000">
              <u>{extension.name}</u>
            </Link>
          ) : (
            extension.name
          )}
        </Typography>
        <ExtensionSelector extension={extension} />
      </Stack>
      <Stack>
        <Tooltip title={extension.description}>
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '4',
              WebkitBoxOrient: 'vertical',
            }}>
            {extension.description}
          </Typography>
        </Tooltip>
      </Stack>
    </Stack>
  </Stack>
);

export default ExtensionBox;
