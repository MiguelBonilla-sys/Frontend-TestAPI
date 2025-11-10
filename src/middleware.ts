import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection
 * Checks authentication status and redirects if necessary
 * Also checks basic role-based access for admin routes
 */

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/videojuegos',
  '/desarrolladoras',
  '/admin',
  '/profile',
];

// Routes that require admin role (editor or superadmin)
const adminRoutes = [
  '/admin',
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register', '/auth/verify-2fa'];

// Public routes that don't require authentication
const publicRoutes = ['/', '/api', '/health'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get authentication token from cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!accessToken;

  // Get user role from cookies (if available)
  const userCookie = request.cookies.get('user')?.value;
  let userRole: string | null = null;
  try {
    if (userCookie) {
      const user = JSON.parse(userCookie);
      userRole = user.role?.toLowerCase() || null;
    }
  } catch (e) {
    // Invalid user cookie, ignore
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Allow API routes to pass through
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Check admin routes - require editor or superadmin role
  if (isAdminRoute && isAuthenticated) {
    const isAdmin = userRole === 'editor' || userRole === 'superadmin';
    if (!isAdmin) {
      // Redirect non-admin users away from admin routes
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Redirect to dashboard if accessing auth routes while authenticated
  // (except verify-2fa which might be needed during login)
  if (isAuthRoute && isAuthenticated && !pathname.startsWith('/auth/verify-2fa')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
