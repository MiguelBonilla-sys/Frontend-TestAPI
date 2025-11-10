/**
 * Middleware Tests
 */

import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => ({ type: 'next' })),
    redirect: jest.fn((url) => ({ type: 'redirect', url: url.toString() })),
  },
}));

describe('Middleware', () => {
  const createMockRequest = (pathname: string, cookies: Record<string, string> = {}) => {
    const baseUrl = 'http://localhost:3000';
    const url = new URL(pathname, baseUrl);
    const request = {
      url: baseUrl + pathname,
      nextUrl: url,
      cookies: {
        get: (name: string) => {
          const value = cookies[name];
          return value ? { value } : undefined;
        },
      },
    } as unknown as NextRequest;
    return request;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow public routes without authentication', () => {
    const request = createMockRequest('/');
    const response = middleware(request);
    expect(response.type).toBe('next');
  });

  it('should redirect to login for protected routes without auth', () => {
    const request = createMockRequest('/dashboard');
    const response = middleware(request);
    expect(response.type).toBe('redirect');
    expect(response.url).toContain('/login');
  });

  it('should allow protected routes with authentication', () => {
    const request = createMockRequest('/dashboard', {
      access_token: 'valid-token',
    });
    const response = middleware(request);
    expect(response.type).toBe('next');
  });

  it('should redirect admin routes for non-admin users', () => {
    const request = createMockRequest('/admin', {
      access_token: 'valid-token',
      user: JSON.stringify({ role: 'desarrolladora' }),
    });
    const response = middleware(request);
    expect(response.type).toBe('redirect');
    expect(response.url).toContain('/dashboard');
  });

  it('should allow admin routes for admin users', () => {
    const request = createMockRequest('/admin', {
      access_token: 'valid-token',
      user: JSON.stringify({ role: 'editor' }),
    });
    const response = middleware(request);
    expect(response.type).toBe('next');
  });

  it('should allow admin routes for superadmin users', () => {
    const request = createMockRequest('/admin', {
      access_token: 'valid-token',
      user: JSON.stringify({ role: 'superadmin' }),
    });
    const response = middleware(request);
    expect(response.type).toBe('next');
  });
});

