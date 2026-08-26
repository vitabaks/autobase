import { DBDESK_URL } from '@shared/config/constants.ts';

/**
 * The embedded SQL editor (dbdesk-studio) is served under DBDESK_URL and cannot
 * send the console's `Authorization` header (it is loaded by navigation and
 * issues its own XHR). nginx guards that path with `auth_request` and reads the
 * console token from this cookie instead (see console/ui/nginx/nginx.conf).
 */
const COOKIE_NAME = 'autobase_dbdesk';

const getCookiePath = (): string => {
  try {
    return new URL(DBDESK_URL || '/dbdesk/', window.location.origin).pathname || '/dbdesk/';
  } catch {
    return '/dbdesk/';
  }
};

const cookieAttributes = (): string => {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  return `Path=${getCookiePath()}; SameSite=Strict${secure}`;
};

export const setDbdeskAuthCookie = (token: string): void => {
  document.cookie = `${COOKIE_NAME}=${token}; ${cookieAttributes()}`;
};

export const clearDbdeskAuthCookie = (): void => {
  document.cookie = `${COOKIE_NAME}=; Max-Age=0; ${cookieAttributes()}`;
};
