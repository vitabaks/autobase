import { FC } from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import { InfoCardBodyProps } from '@shared/ui/info-card-body/model/types.ts';

/**
 * Component renders body of a different summary and overview cards.
 * Recommended to use inside all similar looking card bodies.
 * @param config - Config with data to render.
 * @constructor
 */
const InfoCardBody: FC<InfoCardBodyProps> = ({ config }) => {
  return (
    <Stack gap={1}>
      {config.map(({ title, children }, index) => (
        <Stack key={title} gap={0.5}>
          <Typography color="text.secondary" fontWeight="bold">
            {title}
          </Typography>
          {children}
          {index < config.length - 1 ? <Divider /> : null}
        </Stack>
      ))}
    </Stack>
  );
};

export default InfoCardBody;
