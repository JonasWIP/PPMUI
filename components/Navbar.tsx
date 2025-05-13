import React, { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

type NavbarProps = {
  logo?: string;
  links?: Array<{ label: string; href: string }>;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  userName?: string | null;
};

const Navbar: React.FC<NavbarProps> = ({
  logo = 'Your Logo',
  links = [],
  isAuthenticated = false,
  onLogout,
  userName,
}) => {
  // Filter links - only show Dashboard if the user is authenticated
  const filteredLinks = links.filter(link => 
    link.href !== '/dashboard' || isAuthenticated
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-background border-b border-border shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <div className="text-xl font-bold text-foreground">
          <Link href="/">
            {logo}
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center">
          <ul className="flex space-x-6 mr-6">
            {filteredLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mr-4">
            <ThemeToggle />
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center">
              {userName && (
                <span className="mr-4 text-sm text-muted-foreground">
                  Hello, {userName}
                </span>
              )}
              <Button
                onClick={onLogout}
                variant="destructive"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link href="/register">
                <Button variant="secondary">
                  Register
                </Button>
              </Link>
              <Link href="/login">
                <Button>
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <ul className="flex flex-col space-y-3 p-4">
            {filteredLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition duration-300 block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <ThemeToggle />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;