// Custom cookie utility to avoid external dependencies

export interface CookieOptions {
  expires?: number | Date; // days or Date object
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') return; // SSR safety

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires) {
    let expires: Date;
    if (typeof options.expires === 'number') {
      expires = new Date();
      expires.setTime(expires.getTime() + options.expires * 24 * 60 * 60 * 1000);
    } else {
      expires = options.expires;
    }
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += '; secure';
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
}

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined; // SSR safety

  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return undefined;
}

export function removeCookie(name: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') return; // SSR safety

  setCookie(name, '', {
    ...options,
    expires: new Date(0), // Set to past date to expire immediately
  });
}

export function getAllCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {}; // SSR safety

  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    const eqIndex = cookie.indexOf('=');
    if (eqIndex > 0) {
      const name = decodeURIComponent(cookie.substring(0, eqIndex));
      const value = decodeURIComponent(cookie.substring(eqIndex + 1));
      cookies[name] = value;
    }
  }

  return cookies;
} 