// middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { SupabaseClientHelper } from "@/lib/supabase/client";

export async function middleware(request: NextRequest) {
  // Create an unmodified response
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Get the current path from the URL
  const path = request.nextUrl.pathname;
  
  // Check if we're already on the login page or other public routes to prevent redirect loops
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/cookie-preferences', '/privacy', '/terms', '/impressum'];
  const apiRoutes = ['/api/auth', '/api/proxy'];
  
  // Check for exact match on root path or startsWith for other paths
  const isPublicRoute =
    path === '/' ||
    publicRoutes.some(route => path === route || path.startsWith(`${route}/`)) ||
    apiRoutes.some(route => path.startsWith(route));
    
  // Allow access to public routes without Supabase validation
  if (isPublicRoute) {
    return response;
  }
  
  // Define admin-only routes
  const adminRoutes = ['/api-test', '/admin'];
  const isAdminRoute = adminRoutes.some(route =>
    path === route || path.startsWith(`${route}/`)
  );
  
  // Check if Supabase environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If environment variables are missing, redirect to root for setup instructions
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Missing Supabase environment variables. Redirecting to setup page.');
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  try {
    // Create a Supabase client using our helper class
    const supabase = SupabaseClientHelper.createMiddlewareClient(request, response);
    
    // Check if user is authenticated
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error(`❌ Authentication error: ${error.message}`);
    }

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    
    // For admin routes, check if the user has admin role
    if (isAdminRoute) {
      const { data: hasAdminRole } = await supabase.rpc(
        'current_user_has_role',
        { role_name: 'admin' }
      );
      
      const { data: hasSuperAdminRole } = await supabase.rpc(
        'current_user_has_role',
        { role_name: 'superadmin' }
      );
      
      if (!hasAdminRole && !hasSuperAdminRole) {
        // Redirect non-admin users to dashboard
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    }
  } catch (error) {
    console.error(`💥 Middleware error: ${error instanceof Error ? error.message : String(error)}`);
    // On error, redirect to the root page which contains setup instructions
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return response;
}

// Add a matcher that defines which routes the middleware should run on
export const config = {
  matcher: [
    // Explicitly protect the dashboard route
    '/dashboard/:path*',
    
    // Explicitly protect admin routes (temporarily removed /api-test)
    '/admin/:path*',
    
    // Match other routes except for:
    // - _next (Next.js internals)
    // - Public files (_static, robots.txt, favicon.ico, etc.)
    // - API test page and proxy
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|api-test|api/proxy).*)',
  ],
}
