import '@testing-library/jest-dom';

// Fix React.act compatibility for React 19 with React Testing Library
// React Testing Library expects React.act to be available but React 19
// doesn't export it by default in the testing environment
import React, { act } from 'react';

// Define global interface extension for React
declare global {
  interface Global {
    React: typeof React;
  }
}

// Ensure React.act is available globally for React Testing Library
(global as Global).React = React;
(global as Global).React.act = act;

// Also mock it in the React module to ensure compatibility
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  act: jest.requireActual('react').act || function(callback: () => unknown) {
    // Fallback implementation if act is not available
    const result = callback();
    if (result && typeof result === 'object' && result !== null && 'then' in result) {
      return result as Promise<unknown>;
    }
    return Promise.resolve();
  },
}));

// Mock Next.js environment variables
process.env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: 'http://localhost:54321',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
};

// Mock window object for client components
Object.defineProperty(window, 'ENV_VARS', {
  writable: true,
  value: {
    NEXT_PUBLIC_SUPABASE_URL: 'http://localhost:54321',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
  },
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
      signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signInWithOAuth: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  })),
  getSupabaseClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
      signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signInWithOAuth: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  })),
}));

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    user: null,
    loading: false,
    refreshAuth: jest.fn(() => Promise.resolve()),
    notifyAuthChange: jest.fn(),
  })),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));