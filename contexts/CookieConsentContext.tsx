'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCookieConsent, saveCookieConsent, removeCookieConsent } from '@/lib/cookieConsent';

export interface CookieConsent {
  necessary: boolean;  // Always true, cannot be disabled
  analytics: boolean;  // Can be toggled by user
  marketing?: boolean; // For future expansion
  preferences?: boolean; // For future expansion
  lastUpdated: string; // ISO date string for compliance
}

export type ConsentStatus = 'accepted' | 'declined' | 'not-set';

interface CookieConsentContextType {
  consent: CookieConsent | null;
  consentStatus: ConsentStatus;
  updateConsent: (newConsent: Partial<CookieConsent>) => void;
  acceptAll: () => void;
  declineNonEssential: () => void;
  resetConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}

interface CookieConsentProviderProps {
  children: ReactNode;
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('not-set');
  // Only run on client-side
  useEffect(() => {
    const storedConsent = getCookieConsent();
    
    console.log('CookieConsentContext: Retrieved stored consent:', storedConsent);
    
    if (storedConsent) {
      setConsent(storedConsent);
      setConsentStatus(storedConsent.analytics ? 'accepted' : 'declined');
      console.log('CookieConsentContext: Set consent status to:', storedConsent.analytics ? 'accepted' : 'declined');
    } else {
      console.log('CookieConsentContext: No stored consent found, status remains:', consentStatus);
    }
  }, [consentStatus]);

  const updateConsent = (newConsent: Partial<CookieConsent>) => {
    if (!consent) {
      // Create new consent object with defaults
      const updatedConsent: CookieConsent = {
        necessary: true, // Always required
        analytics: false,
        lastUpdated: new Date().toISOString(),
        ...newConsent
      };
      
      console.log('CookieConsentContext: Creating new consent:', updatedConsent);
      setConsent(updatedConsent);
      setConsentStatus(updatedConsent.analytics ? 'accepted' : 'declined');
      saveCookieConsent(updatedConsent);
      console.log('CookieConsentContext: Saved new consent to cookie');
    } else {
      // Update existing consent
      const updatedConsent = {
        ...consent,
        ...newConsent,
        necessary: true, // Always required
        lastUpdated: new Date().toISOString()
      };
      
      console.log('CookieConsentContext: Updating existing consent:', updatedConsent);
      setConsent(updatedConsent);
      setConsentStatus(updatedConsent.analytics ? 'accepted' : 'declined');
      saveCookieConsent(updatedConsent);
      console.log('CookieConsentContext: Saved updated consent to cookie');
    }
  };

  const acceptAll = () => {
    updateConsent({
      analytics: true,
      marketing: true,
      preferences: true
    });
  };

  const declineNonEssential = () => {
    updateConsent({
      analytics: false,
      marketing: false,
      preferences: false
    });
  };

  const resetConsent = () => {
    console.log('CookieConsentContext: Resetting consent');
    setConsent(null);
    setConsentStatus('not-set');
    // Remove the consent cookie using the utility function
    removeCookieConsent();
    console.log('CookieConsentContext: Consent cookie removed');
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        consentStatus,
        updateConsent,
        acceptAll,
        declineNonEssential,
        resetConsent
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}