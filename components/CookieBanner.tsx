'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CookiePreferencesModal } from '@/components/CookiePreferencesModal';

export function CookieBanner() {
  const { consentStatus, acceptAll, declineNonEssential } = useCookieConsent();
  const [showPreferences, setShowPreferences] = useState(false);

  // Add debugging logs
  console.log('CookieBanner rendered, consent status:', consentStatus);

  // Don't render anything if consent has already been provided
  if (consentStatus !== 'not-set') {
    console.log('CookieBanner not showing - consent already set to:', consentStatus);
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background/95 backdrop-blur-sm border-t shadow-lg">
        <Alert className="max-w-7xl mx-auto">
          <AlertDescription className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="text-sm">
              <p className="mb-2">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                By clicking &quot;Accept All&quot;, you consent to our use of cookies.
              </p>
              <p>
                Read our{' '}
                <Link href="/privacy" className="font-medium underline underline-offset-4 hover:text-primary">
                  Privacy Policy
                </Link>{' '}
                for more information about how we use cookies.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferences(true)}
              >
                Customize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={declineNonEssential}
              >
                Decline Non-Essential
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={acceptAll}
              >
                Accept All
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      {/* Cookie Preferences Modal */}
      <CookiePreferencesModal 
        open={showPreferences} 
        onOpenChange={setShowPreferences} 
      />
    </>
  );
}

export default CookieBanner;