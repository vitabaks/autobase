import { FC, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DBDESK_URL } from '@shared/config/constants.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectActualTheme } from '@app/redux/slices/themeSlice/themeSelectors.ts';

/** Safely parse the DBDESK_URL origin for postMessage targeting. */
const getDbdeskOrigin = (): string | null => {
  if (!DBDESK_URL) return null;
  try {
    return new URL(DBDESK_URL).origin;
  } catch {
    return null;
  }
};

const SqlEditor: FC = () => {
  const { t } = useTranslation('shared');
  const location = useLocation();
  const uri = (location.state as { uri?: string } | null)?.uri ?? null;
  const actualTheme = useAppSelector(selectActualTheme);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const dbdeskOrigin = useMemo(getDbdeskOrigin, []);

  // Build the iframe src: append ?uri= when a connection URI is provided.
  // The URI only appears in the iframe's src attribute (not the browser
  // address bar) and dbdesk-studio navigates away from it immediately
  // after creating the connection profile.
  const iframeSrc = useMemo(() => {
    if (!DBDESK_URL) return '';
    if (!uri) return DBDESK_URL;
    const url = new URL(DBDESK_URL);
    url.searchParams.set('uri', uri);
    return url.toString();
  }, [uri]);

  // Sync theme to the embedded DBDesk iframe via postMessage
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow && dbdeskOrigin) {
      iframe.contentWindow.postMessage(
        { type: 'dbdesk-set-theme', theme: actualTheme },
        dbdeskOrigin,
      );
    }
  }, [actualTheme, dbdeskOrigin]);

  if (!DBDESK_URL || !dbdeskOrigin) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">
          {t('sqlEditor', { ns: 'shared' })}
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
        title={t('sqlEditor', { ns: 'shared' })}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          flexGrow: 1,
        }}
        allow="clipboard-read; clipboard-write"
        onLoad={() => {
          iframeRef.current?.contentWindow?.postMessage(
            { type: 'dbdesk-set-theme', theme: actualTheme },
            dbdeskOrigin,
          );
        }}
      />
    </Box>
  );
};

export default SqlEditor;
