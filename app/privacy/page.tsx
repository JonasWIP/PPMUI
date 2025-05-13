'use client';

import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <PageContainer maxWidth="lg">
      <PageHeader 
        title="Privacy Policy"
        description="How we handle and protect your data"
      />
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            At JHR, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
          </p>
          
          <h3>1. Information We Collect</h3>
          <p>
            We may collect personal information such as your name, email address, and profile information when you register for an account.
            We also collect usage data to improve our services.
          </p>
          
          <h3>2. How We Use Your Information</h3>
          <p>
            We use your information to:
          </p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Notify you about changes to our services</li>
            <li>Provide customer support</li>
            <li>Monitor the usage of our services</li>
            <li>Detect, prevent, and address technical issues</li>
          </ul>
          
          <h3>3. Data Security</h3>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          
          <h3>4. Third-Party Services</h3>
          <p>
            We may employ third-party companies and individuals to facilitate our services, provide services on our behalf, or assist us in analyzing how our services are used.
            These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
          
          <h3>5. Cookie Policy</h3>
          <p>
            Our website uses cookies to enhance your browsing experience. Cookies are small text files that are stored on your device when you visit our website.
          </p>
          
          <h4>Types of Cookies We Use</h4>
          <ul>
            <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly and cannot be disabled.</li>
            <li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website, allowing us to improve our services.</li>
            <li><strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites for advertising purposes.</li>
            <li><strong>Preferences Cookies:</strong> These cookies allow the website to remember choices you make and provide enhanced features.</li>
          </ul>
          
          <h4>Managing Your Cookie Preferences</h4>
          <p>
            You can manage your cookie preferences at any time by clicking on the &quot;Cookie Preferences&quot; link in the footer or by using the cookie banner that appears when you first visit our website.
          </p>
          
          <h3>6. Your Data Protection Rights</h3>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Object to processing of your personal information</li>
            <li>Request restriction of processing your personal information</li>
            <li>Request transfer of your personal information</li>
          </ul>
          
          <div className="mt-8 text-sm text-muted-foreground">
            <p>Last updated: May 13, 2025</p>
            <p>For any questions regarding this privacy policy, please contact us at <a href="mailto:dev.jonas.reitz@gmail.com" className="text-primary hover:underline">dev.jonas.reitz@gmail.com</a>.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}