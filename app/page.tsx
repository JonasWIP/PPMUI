import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { ClientEnvInitializer } from '@/components/setup/ClientEnvInitializer';
export default function HomePage() {
  // Pass environment variables to client (only NEXT_PUBLIC_ ones)
  const clientEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };

  
  
  return (
    <PageContainer maxWidth="xl">
      <ClientEnvInitializer envVars={clientEnvVars} />
      

      
    </PageContainer>
  );
}
