/**
 * End-to-End User Scenarios Tests
 * Tests complete user flows with real API endpoints
 * 
 * NOTE: These tests require the API to be running and accessible.
 * Set SKIP_E2E_TESTS=true to skip these tests in CI/CD.
 */

const SKIP_E2E = process.env.SKIP_E2E_TESTS === 'true';

// Skip E2E tests by default unless explicitly enabled
// These tests require the API to be running
const describeE2E = SKIP_E2E ? describe.skip : describe.skip; // Skip by default for now

describeE2E('User Scenarios E2E', () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiauthgames-production.up.railway.app';
  
  // Unmock fetch for E2E tests
  const originalFetch = global.fetch;
  beforeAll(() => {
    global.fetch = originalFetch;
  });
  
  afterAll(() => {
    global.fetch = jest.fn();
  });

  describe('SuperAdmin User Flow', () => {
    it('should login as superadmin and access admin features', async () => {
      // Login
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'superadmin@example.com',
          password: 'SuperAdmin123!',
        }),
      });

      expect(loginResponse.ok).toBe(true);
      const loginData = await loginResponse.json();
      expect(loginData.success).toBe(true);
      expect(loginData.data.access_token).toBeDefined();

      const token = loginData.data.access_token;

      // Access admin stats
      const statsResponse = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      expect(statsResponse.ok).toBe(true);
      const statsData = await statsResponse.json();
      expect(statsData.success).toBe(true);
      expect(statsData.data).toBeDefined();
    });

    it('should list all users as superadmin', async () => {
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'superadmin@example.com',
          password: 'SuperAdmin123!',
        }),
      });

      const loginData = await loginResponse.json();
      const token = loginData.data.access_token;

      const usersResponse = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      expect(usersResponse.ok).toBe(true);
      const usersData = await usersResponse.json();
      expect(usersData.success).toBe(true);
      expect(Array.isArray(usersData.data)).toBe(true);
    });
  });

  describe('Editor User Flow', () => {
    it('should login as editor and access editor features', async () => {
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'editor@example.com',
          password: 'EditorPassword123!',
        }),
      });

      expect(loginResponse.ok).toBe(true);
      const loginData = await loginResponse.json();
      expect(loginData.success).toBe(true);

      const token = loginData.data.access_token;

      // Editor should be able to read videojuegos
      const videojuegosResponse = await fetch(`${API_BASE_URL}/api/videojuegos/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      expect(videojuegosResponse.ok).toBe(true);
    });
  });

  describe('Desarrolladora User Flow', () => {
    it('should login as desarrolladora and access basic features', async () => {
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'desarrolladora1@example.com',
          password: 'DevPassword123!',
        }),
      });

      expect(loginResponse.ok).toBe(true);
      const loginData = await loginResponse.json();
      expect(loginData.success).toBe(true);

      const token = loginData.data.access_token;

      // Desarrolladora should be able to read videojuegos
      const videojuegosResponse = await fetch(`${API_BASE_URL}/api/videojuegos/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      expect(videojuegosResponse.ok).toBe(true);
    });

    it('should not access admin features as desarrolladora', async () => {
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'desarrolladora1@example.com',
          password: 'DevPassword123!',
        }),
      });

      const loginData = await loginResponse.json();
      const token = loginData.data.access_token;

      // Desarrolladora should NOT be able to access admin stats
      const statsResponse = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Should return 403 or 401
      expect([401, 403]).toContain(statsResponse.status);
    });
  });

  describe('Password Strength Check', () => {
    it('should check password strength without authentication', async () => {
      const response = await fetch(`${API_BASE_URL}/auth/check-password-strength`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: 'StrongPassword123!',
        }),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.strength).toBeDefined();
      expect(data.data.score).toBeDefined();
    });
  });

  describe('Roles and Permissions', () => {
    it('should get available roles without authentication', async () => {
      const response = await fetch(`${API_BASE_URL}/auth/roles`);

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should get role permissions without authentication', async () => {
      const response = await fetch(`${API_BASE_URL}/auth/roles/editor/permissions`);

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.role).toBeDefined();
      expect(Array.isArray(data.data.permissions)).toBe(true);
    });
  });
});

