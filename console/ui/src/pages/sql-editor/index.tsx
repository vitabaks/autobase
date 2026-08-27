import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DBDESK_URL } from '@shared/config/constants.ts';
import { useAppSelector } from '@app/redux/store/hooks.ts';
import { selectActualTheme } from '@app/redux/slices/themeSlice/themeSelectors.ts';

/** Safely parse the DBDESK_URL origin for postMessage targeting. */
const getDbdeskOrigin = (): string | null => {
  if (!DBDESK_URL) return null;
  try {
    return new URL(DBDESK_URL, window.location.origin).origin;
  } catch {
    return null;
  }
};

const SqlEditor: FC = () => {
  const { t } = useTranslation('shared');
  const actualTheme = useAppSelector(selectActualTheme);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const dbdeskOrigin = useMemo(getDbdeskOrigin, []);

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
          DBDesk Studio is not available. To enable it, deploy the dbdesk-studio service.
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
        position: 'relative',
      }}>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper',
          }}>
          <CircularProgress size={48} />
        </Box>
      )}
      <iframe
        ref={iframeRef}
        src={DBDESK_URL}
        title={t('sqlEditor', { ns: 'shared' })}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-popups-to-escape-sandbox allow-downloads"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          flexGrow: 1,
          opacity: isLoading ? 0 : 1,
        }}
        allow="clipboard-read; clipboard-write"
        onLoad={() => {
          setIsLoading(false);
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
