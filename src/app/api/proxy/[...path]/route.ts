import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL || 'https://apiauthgames-production.up.railway.app';

/**
 * Proxy API handler for all HTTP methods
 * This proxy handles CORS and forwards requests to the backend API
 * Route: /api/proxy/[...path]
 *
 * Usage:
 * - Frontend calls: /api/proxy/auth/login
 * - Gets proxied to: https://apiauthgames-production.up.railway.app/auth/login
 */
async function handleRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join('/');
    const url = new URL(request.url);

    // Build the target URL
    const targetUrl = `${API_BASE_URL}/${path}${url.search}`;

    // Get access token from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add authorization header if token exists
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Copy specific headers from the original request
    const authHeader = request.headers.get('Authorization');
    if (authHeader && !accessToken) {
      headers['Authorization'] = authHeader;
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method: request.method,
      headers,
      credentials: 'include',
    };

    // Add body for methods that support it
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      try {
        const body = await request.text();
        if (body) {
          requestOptions.body = body;
        }
      } catch (error) {
        console.error('Error reading request body:', error);
      }
    }

    // Make the request to the backend API
    const response = await fetch(targetUrl, requestOptions);

    // Get response data
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Create response with CORS headers
    const nextResponse = NextResponse.json(data, {
      status: response.status,
      statusText: response.statusText,
    });

    // Add CORS headers
    nextResponse.headers.set('Access-Control-Allow-Origin', '*');
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    nextResponse.headers.set('Access-Control-Allow-Credentials', 'true');

    // Copy relevant headers from the backend response
    const headersToCopy = ['set-cookie', 'cache-control', 'expires', 'etag'];
    headersToCopy.forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        nextResponse.headers.set(header, value);
      }
    });

    return nextResponse;

  } catch (error) {
    console.error('Proxy error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Error al conectar con el servidor',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Export handlers for all HTTP methods
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}
