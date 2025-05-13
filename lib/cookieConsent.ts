'use client';

import { CookieConsent } from '@/contexts/CookieConsentContext';
import Cookies from 'js-cookie';

const COOKIE_NAME = 'cookie_consent';
const COOKIE_EXPIRY_DAYS = 180; // 6 months for GDPR compliance

/**
 * Get the cookie consent from client-side cookies
 */
export function getCookieConsent(): CookieConsent | null {
  // Only run on client-side
  if (typeof window === 'undefined') {
    console.log('cookieConsent: getCookieConsent called server-side, returning null');
    return null;
  }

  const cookieValue = Cookies.get(COOKIE_NAME);
  console.log('cookieConsent: Retrieved cookie value:', cookieValue);
  
  if (!cookieValue) {
    console.log('cookieConsent: No cookie value found');
    return null;
  }

  try {
    const parsedConsent = JSON.parse(cookieValue) as CookieConsent;
    console.log('cookieConsent: Successfully parsed consent:', parsedConsent);
    return parsedConsent;
  } catch (error) {
    console.error('Error parsing cookie consent:', error);
    return null;
  }
}

/**
 * Save the cookie consent to client-side cookies
 */
export function saveCookieConsent(consent: CookieConsent): void {
  // Only run on client-side
  if (typeof window === 'undefined') {
    console.log('cookieConsent: saveCookieConsent called server-side, doing nothing');
    return;
  }

  console.log('cookieConsent: Saving consent:', consent);
  
  Cookies.set(COOKIE_NAME, JSON.stringify(consent), {
    expires: COOKIE_EXPIRY_DAYS,
    path: '/',
    sameSite: 'lax',
    secure: window.location.protocol === 'https:'
  });
  
  console.log('cookieConsent: Cookie saved with expiry:', COOKIE_EXPIRY_DAYS, 'days');
  
  // Verify the cookie was set
  setTimeout(() => {
    const savedValue = Cookies.get(COOKIE_NAME);
    console.log('cookieConsent: Verification - cookie value after save:', savedValue);
  }, 100);
}

/**
 * Helper function to get a cookie consent value for server-side rendering
 * This is a client-safe version that doesn't use next/headers
 */
export function getServerSafeCookieConsent(): CookieConsent | null {
  // This function can be called from both client and server components
  // On the server, it will return null
  // On the client, it will return the cookie value
  if (typeof window === 'undefined') {
    return null;
  }
  
  return getCookieConsent();
}

/**
 * Check if analytics cookies are allowed
 * Use this before initializing analytics
 */
export function isAnalyticsAllowed(): boolean {
  const consent = getCookieConsent();
  return !!consent?.analytics;
}

/**
 * Check if marketing cookies are allowed
 * Use this before initializing marketing tools
 */
export function isMarketingAllowed(): boolean {
  const consent = getCookieConsent();
  return !!consent?.marketing;
}

/**
 * Check if preference cookies are allowed
 */
export function isPreferencesAllowed(): boolean {
  const consent = getCookieConsent();
  return !!consent?.preferences;
}

/**
 * Remove the cookie consent cookie
 * Used when resetting consent
 */
export function removeCookieConsent(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  Cookies.remove(COOKIE_NAME, { path: '/' });
  console.log('cookieConsent: Cookie removed');
}