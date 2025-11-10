/**
 * 2FA Service
 * API service for two-factor authentication operations
 */

import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  TokenResponse,
  Verify2FARequest,
} from '@/types/api';

export const twoFAService = {
  /**
   * Enable 2FA for the authenticated user
   */
  async enable2FA(): Promise<ApiResponse<{ qr_code?: string; secret?: string; message: string }>> {
    return apiClient.post<{ qr_code?: string; secret?: string; message: string }>('/auth/enable-2fa');
  },

  /**
   * Confirm 2FA setup by verifying OTP code
   */
  async confirm2FA(otpCode: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/confirm-2fa', {
      temp_token: '', // Will be handled by server from session
      otp_code: otpCode,
    });
  },

  /**
   * Verify 2FA code during login
   */
  async verify2FA(
    tempToken: string,
    otpCode: string,
    challengeId?: string
  ): Promise<ApiResponse<TokenResponse>> {
    const payload: Verify2FARequest = {
      temp_token: tempToken,
      otp_code: otpCode,
    };

    if (challengeId) {
      payload.challenge_id = challengeId;
    }

    return apiClient.post<TokenResponse>('/auth/verify-2fa', payload, {
      useAuth: false,
    });
  },

  /**
   * Get 2FA status for the authenticated user
   */
  async get2FAStatus(): Promise<ApiResponse<{ enabled: boolean; verified?: boolean }>> {
    return apiClient.get<{ enabled: boolean; verified?: boolean }>('/auth/2fa/status');
  },

  /**
   * Disable 2FA for the authenticated user
   */
  async disable2FA(): Promise<ApiResponse> {
    return apiClient.delete('/auth/disable-2fa');
  },
};
