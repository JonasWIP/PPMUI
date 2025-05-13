'use client';

import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <PageContainer maxWidth="lg">
      <PageHeader 
        title="Terms of Service"
        description="Terms and conditions for using our services"
      />
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Welcome to PPM. By accessing or using our services, you agree to be bound by these Terms of Service.
          </p>
          
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
            If you do not agree with any of these terms, you are prohibited from using or accessing our services.
          </p>
          
          <h3>2. Use License</h3>
          <p>
            Permission is granted to temporarily use our services for personal, non-commercial purposes only. 
            This is the grant of a license, not a transfer of title.
          </p>
          
          <h3>3. Disclaimer</h3>
          <p>
            Our services are provided &ldquo;as is&rdquo;. We make no warranties, expressed or implied, and hereby disclaim all warranties,
            including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose,
            or non-infringement of intellectual property or other violation of rights.
          </p>
          
          <h3>4. Limitations</h3>
          <p>
            In no event shall we be liable for any damages arising out of the use or inability to use our services.
          </p>
          
          <h3>5. Revisions and Errata</h3>
          <p>
            We may make changes to our services, policies, and these Terms of Service at any time without notice.
          </p>
          
          <div className="mt-8 text-sm text-muted-foreground">
            <p>Last updated: May 13, 2025</p>
            <p>For any questions regarding these terms, please contact us at <a href="mailto:dev.jonas.reitz@gmail.com" className="text-primary hover:underline">dev.jonas.reitz@gmail.com</a>.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}