import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
  console.log("GET request received in proxy");
  return handleRequest(request, params.slug || []);
}

export async function POST(request: NextRequest, { params }: { params: { slug: string[] } }) {
  console.log("POST request received in proxy");
  return handleRequest(request, params.slug || []);
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string[] } }) {
  console.log("PUT request received in proxy");
  return handleRequest(request, params.slug || []);
}

export async function PATCH(request: NextRequest, { params }: { params: { slug: string[] } }) {
  console.log("PATCH request received in proxy");
  return handleRequest(request, params.slug || []);
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string[] } }) {
  console.log("DELETE request received in proxy");
  return handleRequest(request, params.slug || []);
}

async function handleRequest(request: NextRequest, slug: string[]) {
  try {
    // Log the incoming request details
    console.log(`Proxy received ${request.method} request for path: /${slug.join('/')}`);
    console.log(`Request URL: ${request.url}`);
    
    // Get the path from the slug
    let requestPath = slug.join('/');
    
    // Make sure the path starts with 'api/'
    if (!requestPath.startsWith('api/')) {
      requestPath = `${requestPath}`;
      console.log(`Added 'api/' prefix to path. New path: ${requestPath}`);
    }
    
    const targetUrl = `http://jonasreitz.de:2020/${requestPath}`;
    
    // Get request headers and filter out ones that might cause issues
    const headers = new Headers();
    
    // Copy all headers from the original request
    request.headers.forEach((value, key) => {
      // Skip headers that might cause issues
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });
    
    // Set the host header for the target
    headers.set('host', 'jonasreitz.de:2020');
    
    // Get query parameters from the URL
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const fullTargetUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl;
    
    console.log(`Proxying to target URL: ${fullTargetUrl}`);
    
    // Get request body if it's a POST/PUT/PATCH request
    let body = null;
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        // Clone the request to avoid consuming the body
        const clonedRequest = request.clone();
        
        // Try to get JSON body
        const jsonBody = await clonedRequest.json();
        body = JSON.stringify(jsonBody);
        console.log('Request body (JSON):', body);
      } catch (err) {
        console.log('Error parsing JSON body:', err);
        
        try {
          // Clone again since we consumed the previous clone
          const clonedRequest = request.clone();
          body = await clonedRequest.text();
          console.log('Request body (Text):', body);
        } catch (err) {
          console.error('Failed to parse request body:', err);
        }
      }
    }
    
    try {
      // Forward the request to the target URL
      console.log(`Making ${request.method} request to: ${fullTargetUrl}`);
      const proxyRes = await fetch(fullTargetUrl, {
        method: request.method,
        headers: headers,
        body: body,
      });

      console.log(`Received response with status: ${proxyRes.status}`);
      
      // Get response data
      let responseData: unknown;
      const contentType = proxyRes.headers.get('content-type') || '';
      console.log(`Response content type: ${contentType}`);
      
      if (contentType.includes('application/json')) {
        responseData = await proxyRes.json();
        console.log('Response data (JSON):', JSON.stringify(responseData).substring(0, 200) + '...');
      } else {
        responseData = await proxyRes.text();
        console.log('Response data (Text):', String(responseData).substring(0, 200) + '...');
      }

      // Create response with the same status and headers
      const response = NextResponse.json(responseData, {
        status: proxyRes.status,
        headers: {
          'Content-Type': contentType,
        },
      });

      // Forward cookies if any
      const setCookie = proxyRes.headers.get('set-cookie');
      if (setCookie) {
        response.headers.set('set-cookie', setCookie);
      }

      return response;
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      
      // Return an error response
      console.log("Returning error response due to fetch error");
      return NextResponse.json({
        status: "error",
        message: "Could not connect to the target API",
        error: fetchError instanceof Error ? fetchError.message : String(fetchError)
      }, { status: 502 });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      {
        error: 'Proxy error',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
