import './globals.css';
import type { Metadata, Viewport } from 'next';
import { CONFIG } from '@/lib/constants';
import NavbarWithAuth from '@/components/NavbarWithAuth';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { AuthProvider } from '@/contexts/AuthContext';
import { CookieConsentProvider } from '@/contexts/CookieConsentContext';
import { ThemeProvider } from '@/components/ui/theme-provider';

// Import Google fonts for our theme system
import { Nunito, Roboto, Roboto_Slab, Inter, JetBrains_Mono, Fira_Code } from 'next/font/google';

// Configure the fonts
const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-slab',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
});

export const metadata: Metadata = {
  title: {
    default: CONFIG.APP_NAME,
    template: `%s | ${CONFIG.APP_NAME}`,
  },
  description: 'A modern template using Next.js and Supabase',
};

export const viewport: Viewport = {
  themeColor: CONFIG.THEME_COLOR,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${nunito.variable} ${roboto.variable} ${robotoSlab.variable} ${inter.variable} ${jetBrainsMono.variable} ${firaCode.variable}`}
    >
      <body className="flex flex-col min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider defaultTheme="default">
          <CookieConsentProvider>
            <AuthProvider>
              <NavbarWithAuth
                logo="PPM"
                links={[
                  { label: 'Home', href: '/' },
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Contact', href: '/impressum' },
                ]}
              />
              <main className="flex-grow">
                {children}
              </main>
              <Footer
                companyName="PPM"
                links={[
                  { label: 'Home', href: '/' },
                  { label: 'Terms', href: '/terms' },
                  { label: 'Privacy', href: '/privacy' },
                  { label: 'Cookie Preferences', href: '/cookie-preferences' },
                  { label: 'Impressum', href: '/impressum' },
                ]}
              />
              <CookieBanner />
            </AuthProvider>
          </CookieConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
