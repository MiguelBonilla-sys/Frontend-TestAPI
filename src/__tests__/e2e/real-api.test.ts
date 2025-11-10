/**
 * Real API E2E Tests
 * These tests connect to the actual API and should be run manually
 * 
 * To run: SKIP_E2E_TESTS=false npm test -- src/__tests__/e2e/real-api.test.ts
 */

const SKIP_E2E = process.env.SKIP_E2E_TESTS !== 'false'; // Skip by default
const describeE2E = SKIP_E2E ? describe.skip : describe;

describeE2E('Real API E2E Tests', () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiauthgames-production.up.railway.app';

  // Test users
  const testUsers = {
    superadmin: {
      email: 'superadmin@example.com',
      password: 'SuperAdmin123!',
    },
    editor: {
      email: 'editor@example.com',
      password: 'EditorPassword123!',
    },
    desarrolladora1: {
      email: 'desarrolladora1@example.com',
      password: 'DevPassword123!',
    },
    desarrolladora2: {
      email: 'desarrolladora2@example.com',
      password: 'DevPassword123!',
    },
  };

  describe('SuperAdmin Login and Access', () => {
    let token: string;

    it('should login as superadmin', async () => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUsers.superadmin),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.access_token).toBeDefined();
      token = data.data.access_token;
    });

    it('should access admin stats', async () => {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.total_users).toBeDefined();
    });

    it('should list all users', async () => {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe('Editor Login and Access', () => {
    let token: string;

    it('should login as editor', async () => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUsers.editor),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      token = data.data.access_token;
    });

    it('should access videojuegos', async () => {
      const response = await fetch(`${API_BASE_URL}/api/videojuegos/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      expect(response.ok).toBe(true);
    });
  });

  describe('Desarrolladora Login and Access', () => {
    let token: string;

    it('should login as desarrolladora', async () => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUsers.desarrolladora1),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      token = data.data.access_token;
    });

    it('should access videojuegos', async () => {
      const response = await fetch(`${API_BASE_URL}/api/videojuegos/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      expect(response.ok).toBe(true);
    });

    it('should NOT access admin features', async () => {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      // Should return 403 or 401
      expect([401, 403]).toContain(response.status);
    });
  });

  describe('Public Endpoints', () => {
    it('should get available roles without auth', async () => {
      const response = await fetch(`${API_BASE_URL}/auth/roles`);
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should check password strength without auth', async () => {
      const response = await fetch(`${API_BASE_URL}/auth/check-password-strength`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'TestPassword123!' }),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.strength).toBeDefined();
    });
  });
});

