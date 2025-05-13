'use client';

import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ImpressumPage() {
  return (
    <PageContainer maxWidth="lg">
      <PageHeader 
        title="Impressum"
        description="Legal information about this website"
      />
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">JHR - Irgendwas mit Reitz</h3>
            <p className="text-muted-foreground">Inhaber: Jonas Reitz</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Address</h3>
            <address className="not-italic text-muted-foreground">
              Marshallstraße 9<br />
              35394 Gießen<br />
              Germany
            </address>
          </div>
          
          <div>
            <h3 className="font-semibold">Contact</h3>
            <p className="text-muted-foreground">
              Email: <a href="mailto:dev.jonas.reitz@gmail.com" className="text-primary hover:underline">dev.jonas.reitz@gmail.com</a>
            </p>
          </div>
          
          <div className="pt-4 border-t border-border">
            <h3 className="font-semibold mb-2">Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              Despite careful content control, we assume no liability for the content of external links. 
              The operators of the linked pages are solely responsible for their content.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}