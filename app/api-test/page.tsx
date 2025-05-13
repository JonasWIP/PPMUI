import { projectsApi } from '@/lib/projectsApi';
import { ApiError } from '@/lib/api';
import { SupabaseServerHelper } from '@/lib/supabase/server-client';

export const dynamic = 'force-dynamic'; // Ensures SSR on every request

async function getServerData() {
  // Use Supabase server client to get the current user
  const supabase = await SupabaseServerHelper.createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch projects data
  try {
    console.log('Server-side: Calling projectsApi.listProjects()...');
    const projects = await projectsApi.listProjects();
    console.log('Server-side: Response received');
    
    return {
      projects,
      user,
      error: null
    };
  } catch (err) {
    console.error('Server-side: Error testing API client:', err);
    let errorMessage = 'Unknown error occurred';
    
    if (err instanceof ApiError) {
      errorMessage = `API Error (${err.status}): ${err.message}`;
    } else {
      if (err instanceof Error) {
        errorMessage = `Unexpected error: ${err.message}\nStack trace: ${err.stack || 'No stack trace available'}`;
      } else {
        errorMessage = `Unexpected error: ${String(err)}`;
      }}
    
    return {
      projects: null,
      user,
      error: errorMessage
    };
  }
}

export default async function ApiTestPage() {
  // Fetch data on the server
  const { projects, user, error } = await getServerData();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Client Test (Server-Side Rendered)</h1>
      
      {user && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Authenticated User</p>
          <p>{user.email}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">API Response (Server-Side):</h2>
        <pre className="whitespace-pre-wrap bg-white p-4 border rounded">
          {projects ? JSON.stringify(projects, null, 2) : 'No data available'}
        </pre>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="text-md font-semibold mb-2">About This Page</h3>
        <p>This page is server-side rendered and protected - only authenticated users can access it.</p>
        <p className="mt-2">The API request is made on the server, not in the browser.</p>
      </div>
    </div>
  );
}