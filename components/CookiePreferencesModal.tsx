'use client';

import React from 'react';
import Link from 'next/link';
import { useCookieConsent, CookieConsent } from '@/contexts/CookieConsentContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CookiePreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CookiePreferencesModal({ open, onOpenChange }: CookiePreferencesModalProps) {
  const { consent, updateConsent, acceptAll, declineNonEssential } = useCookieConsent();
  
  // Create a local state for the form
  const [localConsent, setLocalConsent] = React.useState<Partial<CookieConsent>>({
    necessary: true, // Always required
    analytics: consent?.analytics || false,
    marketing: consent?.marketing || false,
    preferences: consent?.preferences || false,
  });

  // Update local state when consent changes
  React.useEffect(() => {
    setLocalConsent({
      necessary: true,
      analytics: consent?.analytics || false,
      marketing: consent?.marketing || false,
      preferences: consent?.preferences || false,
    });
  }, [consent]);

  const handleSavePreferences = () => {
    console.log('CookiePreferencesModal: Saving preferences:', localConsent);
    updateConsent(localConsent);
    onOpenChange(false);
  };

  const handleToggle = (key: keyof CookieConsent) => {
    if (key === 'necessary') return; // Cannot toggle necessary cookies
    
    console.log(`CookiePreferencesModal: Toggling ${key} cookie preference`);
    
    setLocalConsent((prev) => {
      const newValue = !prev[key as keyof typeof prev];
      console.log(`CookiePreferencesModal: ${key} set to ${newValue}`);
      return {
        ...prev,
        [key]: newValue,
      };
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cookie Preferences</DialogTitle>
          <DialogDescription>
            Customize your cookie preferences. Essential cookies are always enabled as they are necessary for the website to function properly.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Necessary Cookies - Always enabled */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Essential Cookies</Label>
              <p className="text-sm text-muted-foreground">
                Required for the website to function properly. Cannot be disabled.
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>
          
          {/* Analytics Cookies */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Analytics Cookies</Label>
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
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Marketing Cookies</Label>
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
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Preferences Cookies</Label>
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
        
        <div className="text-sm text-muted-foreground mt-2">
          <p>
            For more information about how we use cookies, please read our{' '}
            <Link href="/privacy" className="font-medium underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>.
          </p>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={declineNonEssential}
              className="flex-1 sm:flex-none"
            >
              Decline All
            </Button>
            <Button
              variant="outline"
              onClick={acceptAll}
              className="flex-1 sm:flex-none"
            >
              Accept All
            </Button>
          </div>
          <Button onClick={handleSavePreferences}>Save Preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}