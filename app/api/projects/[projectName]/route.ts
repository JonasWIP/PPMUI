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

// Helper to verify admin access
async function verifyAdminAccess() {
  const supabase = await SupabaseServerHelper.createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Authentication required', status: 401 };
  }
  
  const hasAdminAccess = await checkAdminAccess();
  if (!hasAdminAccess) {
    return { error: 'Admin access required', status: 403 };
  }
  
  return { user };
}

// GET handler for getting project config
export async function GET(
  request: Request,
  context: { params: Promise<{ projectName: string }> }
) {
  try {
    const { projectName } = await context.params;
    
    // Verify admin access
    const accessCheck = await verifyAdminAccess();
    if ('error' in accessCheck) {
      return NextResponse.json(
        { error: accessCheck.error },
        { status: accessCheck.status }
      );
    }
    
    // Configure OpenAPI for server-side use
    configureProjectsApi();
    
    // Call the Projects API
    const result = await ProjectsService.getProjectsConfig({ projectName });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in projects API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project config' },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting a project
export async function DELETE(
  request: Request,
  context: { params: Promise<{ projectName: string }> }
) {
  try {
    const { projectName } = await context.params;
    
    // Verify admin access
    const accessCheck = await verifyAdminAccess();
    if ('error' in accessCheck) {
      return NextResponse.json(
        { error: accessCheck.error },
        { status: accessCheck.status }
      );
    }
    
    // Configure OpenAPI for server-side use
    configureProjectsApi();
    
    // Call the Projects API
    const result = await ProjectsService.deleteProjects({ projectName });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in projects API route:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

// PUT handler for updating project config
export async function PUT(
  request: Request,
  context: { params: Promise<{ projectName: string }> }
) {
  try {
    const { projectName } = await context.params;
    
    // Verify admin access
    const accessCheck = await verifyAdminAccess();
    if ('error' in accessCheck) {
      return NextResponse.json(
        { error: accessCheck.error },
        { status: accessCheck.status }
      );
    }
    
    // Parse request body
    const requestBody = await request.json();
    
    // Configure OpenAPI for server-side use
    configureProjectsApi();
    
    // Call the Projects API
    const result = await ProjectsService.putProjectsConfig({
      projectName,
      requestBody
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in projects API route:', error);
    return NextResponse.json(
      { error: 'Failed to update project config' },
      { status: 500 }
    );
  }
}