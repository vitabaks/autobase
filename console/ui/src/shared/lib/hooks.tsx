import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

/**
 * Hook polls RTK query request every N milliseconds.
 * @param request - RTK request to poll.
 * @param pollingInterval - Polling interval in ms. Use 0 to disable polling.
 * @param options - Different config options.
 */
export const useQueryPolling = (request: any, pollingInterval: number, options?: { stop?: boolean }) => {
  const result = request();
  const stop = options?.stop === true;

  useEffect(() => {
    if (stop || !pollingInterval || pollingInterval <= 0) return;
    const polling = setInterval(() => result.refetch(), pollingInterval);
    return () => {
      clearInterval(polling);
    };
  }, [pollingInterval, stop]);

  return result;
};

/**
 * Custom hook for copying value to clipboard. Returns copied value and function to copy value.
 */
export const useCopyToClipboard = (): [copiedText: string | null, copyFunction: (text: string) => Promise<boolean>] => {
  const { t } = useTranslation('toasts');
  const [copiedText, setCopiedText] = useState(null);

  const copyFunction = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopiedText(text);
      toast.success(t('valueCopiedToClipboard'));
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      toast.error(t('failedToCopyToClipboard'));
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copyFunction];
};
