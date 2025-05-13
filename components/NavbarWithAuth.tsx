'use client';

import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';

type NavbarWithAuthProps = {
  logo?: string;
  links?: Array<{ label: string; href: string }>;
};

export default function NavbarWithAuth({
  logo = 'PPM',
  links = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Contact', href: '/impressum' },
  ]
}: NavbarWithAuthProps) {
  const { isAuthenticated, userName, isLoading, signOut, isAdmin } = useAuth();

  if (isLoading) {
    // Return a simplified navbar during loading
    return (
      <nav className="bg-background border-b border-border shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-4 py-4">
          <div className="text-xl font-bold text-foreground">{logo}</div>
        </div>      </nav>
    );
  }
  
  // Add API Test link for admin users
  const navLinks = isAdmin 
    ? [...links, { label: 'API Test', href: '/api-test' }]
    : links;

  return (
    <Navbar
      logo={logo}
      links={navLinks}
      isAuthenticated={isAuthenticated}
      onLogout={signOut}
      userName={userName}
    />
  );
}