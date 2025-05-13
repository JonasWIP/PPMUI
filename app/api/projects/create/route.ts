import { NextResponse } from 'next/server';
import { ProjectsService } from '@/lib/generated';
import { SupabaseServerHelper } from '@/lib/supabase/server-client';
import { configureProjectsApi } from '@/lib/projectsApi';

// Check if the current user has admin access
async function checkAdminAccess() {
  const supabase = await SupabaseServerHelper.createServerClient();
  
  const { data: isAdmin } = await supabase.rpc(
    'current_user_has_role',
    { role_name: 'admin' }
  );
  
  const { data: isSuperAdmin } = await supabase.rpc(
    'current_user_has_role',
    { role_name: 'superadmin' }
  );
  
  return (isAdmin === true || isSuperAdmin === true);
}

// POST handler for creating a project
export async function POST(request: Request) {
  try {
    // Get the user from the session
    const supabase = await SupabaseServerHelper.createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check for admin access
    const hasAdminAccess = await checkAdminAccess();
    if (!hasAdminAccess) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const requestBody = await request.json();
    
    // Configure OpenAPI for server-side use
    configureProjectsApi();
    
    // Call the Projects API
    const result = await ProjectsService.postProjectsCreate({ requestBody });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in projects create API route:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}