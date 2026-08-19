import { FC, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const PRICING_URL = 'https://autobase.tech/pricing';
const ENTERPRISE_URL = 'https://autobase.tech/docs#getting-started';

interface FeatureLineProps {
  children: string;
  emphasized?: boolean;
  kind?: 'included' | 'limited';
}

const FeatureLine: FC<FeatureLineProps> = ({ children, emphasized = false, kind = 'included' }) => (
  <Stack data-feature-kind={kind} direction="row" alignItems="flex-start" gap={1.25}>
    <Box
      aria-hidden="true"
      sx={(theme) => ({
        alignItems: 'center',
        backgroundColor: emphasized ? theme.palette.primary.main : theme.palette.action.selected,
        borderRadius: '50%',
        color: emphasized ? theme.palette.primary.contrastText : theme.palette.text.secondary,
        display: 'flex',
        flex: '0 0 auto',
        fontSize: kind === 'limited' ? '0.875rem' : '0.7rem',
        fontWeight: kind === 'limited' ? 600 : 400,
        height: 20,
        justifyContent: 'center',
        marginTop: '2px',
        width: 20,
      })}>
      {kind === 'limited' ? '−' : '✓'}
    </Box>
    <Typography color={emphasized ? 'text.primary' : 'text.secondary'} variant="body2">
      {children}
    </Typography>
  </Stack>
);

const UpgradeToEnterprise: FC = () => {
  const { t } = useTranslation('shared');
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      <Button
        aria-haspopup="dialog"
        onClick={openDialog}
        size="small"
        sx={{ boxShadow: 'none', textTransform: 'none' }}
        variant="contained">
        {t('upgrade.button')}
      </Button>

      <Dialog
        aria-labelledby="upgrade-dialog-title"
        fullWidth
        maxWidth="md"
        onClose={closeDialog}
        open={isOpen}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              overflow: 'hidden',
            },
          },
        }}>
        <Box sx={{ padding: '20px 24px' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Box
                aria-hidden="true"
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'primary.main',
                  borderRadius: 1.5,
                  color: 'primary.contrastText',
                  display: 'flex',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  height: 32,
                  justifyContent: 'center',
                  width: 32,
                }}>
                E
              </Box>
              <Typography component="h2" fontWeight={500} id="upgrade-dialog-title" variant="h5">
                {t('upgrade.title')}
              </Typography>
            </Stack>
            <IconButton aria-label={t('upgrade.close')} edge="end" onClick={closeDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        <DialogContent dividers sx={{ padding: 3 }}>
          <Stack gap={3}>
            <Typography color="text.secondary">{t('upgrade.description')}</Typography>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              }}>
              <Paper
                variant="outlined"
                sx={{ borderColor: 'divider', borderRadius: 2, boxShadow: 'none', padding: 2.5 }}>
                <Stack gap={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                    <Typography fontWeight={600} variant="h6">
                      {t('upgrade.community.title')}
                    </Typography>
                    <Chip label={t('upgrade.community.badge')} size="small" />
                  </Stack>
                  <FeatureLine>{t('upgrade.community.deployment')}</FeatureLine>
                  <FeatureLine kind="limited">{t('upgrade.community.limited')}</FeatureLine>
                  <FeatureLine kind="limited">{t('upgrade.community.no-support')}</FeatureLine>
                </Stack>
              </Paper>

              <Paper
                component="a"
                href={ENTERPRISE_URL}
                rel="noopener noreferrer"
                target="_blank"
                variant="outlined"
                sx={(theme) => ({
                  backgroundColor: theme.palette.primary.lighter10,
                  borderColor: theme.palette.primary.main,
                  borderRadius: 2,
                  boxShadow: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 2.5,
                  textDecoration: 'none',
                  transition: 'background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.lighter10,
                    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
                  },
                  '&:focus-visible': {
                    outline: `3px solid ${theme.palette.primary.main}`,
                    outlineOffset: 2,
                  },
                })}>
                <Stack gap={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                    <Typography fontWeight={600} variant="h6">
                      {t('upgrade.enterprise.title')}
                    </Typography>
                    <Chip color="primary" label={t('upgrade.enterprise.badge')} size="small" />
                  </Stack>
                  <FeatureLine emphasized>{t('upgrade.enterprise.lifecycle')}</FeatureLine>
                  <FeatureLine emphasized>{t('upgrade.enterprise.operations')}</FeatureLine>
                  <FeatureLine emphasized>{t('upgrade.enterprise.support')}</FeatureLine>
                </Stack>
              </Paper>
            </Box>

            <Box
              sx={(theme) => ({
                alignItems: { sm: 'center' },
                backgroundColor: theme.palette.action.hover,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'space-between',
                padding: 2.5,
              })}>
              <Box>
                <Typography fontWeight={600}>{t('upgrade.pricing.title')}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {t('upgrade.pricing.description')}
                </Typography>
              </Box>
              <Button
                component="a"
                href={PRICING_URL}
                rel="noopener noreferrer"
                sx={{ flex: '0 0 auto', textTransform: 'none' }}
                target="_blank"
                variant="contained">
                {t('upgrade.pricing.button')}
              </Button>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ padding: '12px 24px' }}>
          <Button onClick={closeDialog} sx={{ textTransform: 'none' }}>
            {t('upgrade.later')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpgradeToEnterprise;
