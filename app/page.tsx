'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ClientEnvInitializer } from '@/components/setup/ClientEnvInitializer'

export default function HomePage() {
  const router = useRouter()
  
  // Pass environment variables to client (only NEXT_PUBLIC_ ones)
  const clientEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };

  useEffect(() => {
    // Redirect to dashboard
    router.push('/dashboard')
  }, [router])
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <ClientEnvInitializer envVars={clientEnvVars} />
      <div className="text-cyan-400 text-xl">Redirecting to dashboard...</div>
    </div>
  );
}
