import { FC } from 'react';
import BreadcrumbsItem from '@entities/breadcumb-item';
import useBreadcrumbs from '@/features/bradcrumbs/hooks/useBreadcrumbs.tsx';
import { Breadcrumbs as MaterialBreadcrumbs, Icon, Typography, useTheme } from '@mui/material';
import RouterPaths from '@app/router/routerPathsConfig';
import HomeOutlinedIcon from '@assets/HomeOutlinedIcon.svg?react';
import { generateAbsoluteRouterPath } from '@shared/lib/functions.ts';
import { Link } from 'react-router-dom';

const Breadcrumbs: FC = () => {
  const breadcrumbs = useBreadcrumbs();
  const theme = useTheme();

  return (
    <MaterialBreadcrumbs>
      <Link
        style={{ textDecoration: 'none', color: theme.palette.text.primary }}
        to={generateAbsoluteRouterPath(RouterPaths.clusters.absolutePath).pathname}>
        <Icon sx={{ display: 'flex' }}>
          <HomeOutlinedIcon width={22} height={22} style={{ fill: theme.palette.text.primary }} />
        </Icon>
      </Link>
      {breadcrumbs.map((breadcrumb, index) =>
        index === breadcrumbs.length - 1 ? (
          <Typography key={breadcrumb.path} color="text.primary">
            {breadcrumb.label}
          </Typography>
        ) : (
          <BreadcrumbsItem key={breadcrumb.path} {...breadcrumb} />
        ),
      )}
    </MaterialBreadcrumbs>
  );
};

export default Breadcrumbs;
