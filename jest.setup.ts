import '@testing-library/jest-dom';

// Mock React.act for React 19 compatibility
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  act: jest.fn((fn) => fn()),
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