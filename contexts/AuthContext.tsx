'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getCurrentUser, getUserProfile, signOut as supabaseSignOut, getSupabaseClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

type UserProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userName: string | null;
  
  // New properties
  roles: string[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isMember: boolean;
  hasRole: (roleName: string) => boolean;
  
  refreshAuth: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const router = useRouter();

  const refreshAuth = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser as User);
        
        const userProfile = await getUserProfile();
        setProfile(userProfile);
        
        // Fetch user roles
        const supabase = getSupabaseClient();
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role_id, roles(name)')
          .eq('user_id', currentUser.id);
          
        if (userRoles) {
          const roleNames = userRoles.map(ur => ur.roles.name);
          setRoles(roleNames);
        } else {
          setRoles([]);
        }
        
        // Set username
        if (userProfile) {
          setUserName(userProfile.username || userProfile.full_name || currentUser.email || 'User');
        } else {
          setUserName(currentUser.email || 'User');
        }
      } else {
        setUser(null);
        setProfile(null);
        setUserName(null);
        setRoles([]);
      }
    } catch (error) {
      console.error('Error refreshing auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if user has a specific role
  const hasRole = (roleName: string): boolean => {
    return roles.includes(roleName);
  };
  
  // Provide role-based convenience properties
  const isAdmin = hasRole('admin') || hasRole('superadmin');
  const isSuperAdmin = hasRole('superadmin');
  const isMember = hasRole('member') || isAdmin;
  
  const signOut = async () => {
    try {
      await supabaseSignOut();
      setUser(null);
      setProfile(null);
      setUserName(null);
      setRoles([]);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    refreshAuth();
    
    // Subscribe to authentication changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'supabase.auth.token') {
        refreshAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    userName,
    
    // New values
    roles,
    isAdmin,
    isSuperAdmin,
    isMember,
    hasRole,
    
    refreshAuth,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}