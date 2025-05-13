'use client';

import React, { useState, useEffect } from 'react';
import { useCookieConsent, CookieConsent } from '@/contexts/CookieConsentContext';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CookiePreferencesPage() {
  const { consent, updateConsent, acceptAll, declineNonEssential } = useCookieConsent();
  
  // Create a local state for the form
  const [localConsent, setLocalConsent] = useState<Partial<CookieConsent>>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false,
  });

  // Update local state when consent changes
  useEffect(() => {
    if (consent) {
      setLocalConsent({
        necessary: true,
        analytics: consent.analytics || false,
        marketing: consent.marketing || false,
        preferences: consent.preferences || false,
      });
    }
  }, [consent]);

  const handleSavePreferences = () => {
    console.log('CookiePreferencesPage: Saving preferences:', localConsent);
    updateConsent(localConsent);
  };

  const handleToggle = (key: keyof CookieConsent) => {
    if (key === 'necessary') return; // Cannot toggle necessary cookies
    
    console.log(`CookiePreferencesPage: Toggling ${key} cookie preference`);
    
    setLocalConsent((prev) => {
      const newValue = !prev[key as keyof typeof prev];
      console.log(`CookiePreferencesPage: ${key} set to ${newValue}`);
      return {
        ...prev,
        [key]: newValue,
      };
    });
  };

  return (
    <PageContainer maxWidth="lg">
      <PageHeader 
        title="Cookie Preferences"
        description="Manage your cookie settings"
      />
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Cookie Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            This page allows you to customize which cookies you want to accept. Essential cookies cannot be disabled as they are necessary for the website to function properly.
          </p>
          
          <div className="space-y-6">
            {/* Necessary Cookies - Always enabled */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Essential Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Required for the website to function properly. Cannot be disabled.
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>
            
            {/* Analytics Cookies */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Analytics Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              <Switch 
                checked={localConsent.analytics} 
                onCheckedChange={() => handleToggle('analytics')} 
              />
            </div>
            
            {/* Marketing Cookies - For future use */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Marketing Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Used to track visitors across websites for advertising purposes.
                </p>
              </div>
              <Switch 
                checked={localConsent.marketing} 
                onCheckedChange={() => handleToggle('marketing')} 
              />
            </div>
            
            {/* Preferences Cookies - For future use */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Preferences Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Allow the website to remember choices you make and provide enhanced features.
                </p>
              </div>
              <Switch 
                checked={localConsent.preferences} 
                onCheckedChange={() => handleToggle('preferences')} 
              />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground mt-4">
            <p>
              For more information about how we use cookies, please read our{' '}
              <Link href="/privacy" className="font-medium underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="outline"
              onClick={declineNonEssential}
              className="flex-1"
            >
              Decline All Non-Essential
            </Button>
            <Button
              variant="outline"
              onClick={acceptAll}
              className="flex-1"
            >
              Accept All
            </Button>
            <Button 
              onClick={handleSavePreferences}
              className="flex-1"
            >
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}