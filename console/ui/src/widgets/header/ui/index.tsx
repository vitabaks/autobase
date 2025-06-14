import React, { FC, useEffect } from 'react';
import { AppBar, Box, MenuItem, Stack, TextField, Toolbar, Typography } from '@mui/material';
import Logo from '@shared/assets/AutobaseLogo.svg?react';
import LogoutButton from '@features/logout-button';
import ThemeToggle from '@features/theme-toggle';
import { useGetProjectsQuery } from '@shared/api/api/projects.ts';
import { setProject } from '@app/redux/slices/projectSlice/projectSlice.ts';
import { selectCurrentProject } from '@app/redux/slices/projectSlice/projectSelectors.ts';
import { useAppDispatch, useAppSelector } from '@app/redux/store/hooks.ts';
import { useTranslation } from 'react-i18next';

const Header: FC = () => {
  const { t } = useTranslation('shared');
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector(selectCurrentProject);

  const projects = useGetProjectsQuery({ limit: 999_999_999 });

  useEffect(() => {
    if (!currentProject && projects.data?.data) dispatch(setProject(String(projects.data?.data?.[0]?.id)));
  }, [projects.data?.data, dispatch, currentProject]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setProject(e.target.value));
  };

  return (
    <AppBar
      position="fixed"
      sx={(theme) => ({
        zIndex: theme.zIndex.drawer + 1,
        borderBottom: theme.palette.mode === 'light' ? '1px solid' : 'none',
        borderBottomColor: theme.palette.mode === 'light' ? 'divider' : 'transparent',
      })}
      elevation={0}
    >
      <Toolbar sx={{ paddingLeft: '16px !important' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <Stack direction="row" alignItems="center" gap="26px">
            <Stack direction="row" alignItems="center" gap="16px" marginLeft="4px">
              <Logo style={{ width: '35px', height: '35px' }} data-logo="true" />
              <Box>
                <Typography fontWeight="400" sx={{ color: 'text.primary', lineHeight: 1.2 }}>
                  autobase
                </Typography>
                <Typography fontWeight="500" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>
                  for PostgreSQL®
                </Typography>
              </Box>
            </Stack>
            <TextField
              sx={{ minWidth: '120px', maxWidth: '150px' }}
              select
              size="small"
              value={currentProject}
              onChange={handleProjectChange}
              label={t('project')}>
              {projects.data?.data?.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              )) ?? []}
            </TextField>
          </Stack>
          <Stack direction="row" alignItems="center" gap="8px">
            <ThemeToggle />
          <LogoutButton />
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
