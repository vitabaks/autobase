import { FC } from 'react';
import { BreadcrumbsItemProps } from '@entities/breadcumb-item/model/types.ts';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material';

const BreadcrumbsItem: FC<BreadcrumbsItemProps> = ({ label, path }) => {
  const theme = useTheme();

  return (
    <Link style={{ textDecoration: 'none', color: theme.palette.text.primary }} to={path}>
    {label}
  </Link>
);
};

export default BreadcrumbsItem;
