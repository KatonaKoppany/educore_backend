import { CookieOptions } from 'express';

export const COOKIE_BASE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
};

export const ACCESS_COOKIE_OPTIONS: CookieOptions = {
  ...COOKIE_BASE_OPTIONS,
  maxAge: 15 * 60 * 1000,
};

export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  ...COOKIE_BASE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
