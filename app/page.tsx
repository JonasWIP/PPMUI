'use client'

import { ClientEnvInitializer } from '@/components/setup/ClientEnvInitializer'

export default function HomePage() {
  // Pass environment variables to client (only NEXT_PUBLIC_ ones)
  const clientEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <ClientEnvInitializer envVars={clientEnvVars} />
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to SaaSaS</h1>
        <p className="text-lg text-muted-foreground mb-8">
          SaaSaS (Software as a Software automation Service) is a platform designed to streamline software development and deployment through automation. Manage, develop, and deploy your projects with ease using our unified interface.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a href="/projects" className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition">View Projects</a>
          <a href="/create-project" className="px-6 py-3 bg-secondary text-primary rounded-lg font-semibold hover:bg-secondary/80 transition">Create Project</a>
        </div>
        <div className="mt-12 text-sm text-muted-foreground">
          <p>Features include:</p>
          <ul className="list-disc list-inside text-left mx-auto max-w-md mt-2">
            <li>Project management dashboard</li>
            <li>Template-based project creation</li>
            <li>Integrated development environment</li>
            <li>Automated deployment pipeline</li>
            <li>Real-time project updates</li>
            <li>And more!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
