import { FC, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DBDESK_URL } from '@shared/config/constants.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectActualTheme } from '@app/redux/slices/themeSlice/themeSelectors.ts';

const SqlEditor: FC = () => {
  const { t } = useTranslation('shared');
  const location = useLocation();
  const uri = (location.state as { uri?: string } | null)?.uri ?? null;
  const actualTheme = useAppSelector(selectActualTheme);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build the iframe src: if a connection URI was passed, append it as ?uri= to DBDESK_URL
  const iframeSrc = uri ? `${DBDESK_URL}?uri=${encodeURIComponent(uri)}` : DBDESK_URL;

  // Sync theme to the embedded DBDesk iframe via postMessage
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: 'dbdesk-set-theme', theme: actualTheme },
        '*',
      );
    }
  }, [actualTheme]);

  if (!DBDESK_URL) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">
          {t('SQL Editor', { defaultValue: 'SQL Editor' })}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          DBDesk Studio URL is not configured. Set the <code>PG_CONSOLE_DBDESK_URL</code> environment variable.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        title={t('SQL Editor', { defaultValue: 'SQL Editor' })}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          flexGrow: 1,
        }}
        allow="clipboard-read; clipboard-write"
        onLoad={() => {
          // Send initial theme once the iframe has loaded
          iframeRef.current?.contentWindow?.postMessage(
            { type: 'dbdesk-set-theme', theme: actualTheme },
            '*',
          );
        }}
      />
    </Box>
  );
};

export default SqlEditor;
