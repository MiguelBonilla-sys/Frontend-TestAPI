/**
 * 2FA Service
 * API service for two-factor authentication operations
 */

import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  Enable2FAResponse,
  Confirm2FAResponse,
  LoginResponse,
  TwoFAStatusResponse,
  Verify2FARequest,
} from '@/types/api';

export const twoFAService = {
  /**
   * Enable 2FA for the authenticated user
   */
  async enable2FA(): Promise<Enable2FAResponse> {
    return apiClient.post<Enable2FAResponse>('/auth/enable-2fa');
  },

  /**
   * Confirm 2FA setup by verifying OTP code
   */
  async confirm2FA(otpCode: string): Promise<Confirm2FAResponse> {
    return apiClient.post<Confirm2FAResponse>('/auth/confirm-2fa', {
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
  ): Promise<LoginResponse> {
    const payload: Verify2FARequest = {
      temp_token: tempToken,
      otp_code: otpCode,
    };

    if (challengeId) {
      payload.challenge_id = challengeId;
    }

    return apiClient.post<LoginResponse>('/auth/verify-2fa', payload, {
      useAuth: false,
    });
  },

  /**
   * Get 2FA status for the authenticated user
   */
  async get2FAStatus(): Promise<TwoFAStatusResponse> {
    return apiClient.get<TwoFAStatusResponse>('/auth/2fa/status');
  },

  /**
   * Disable 2FA for the authenticated user
   */
  async disable2FA(): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>('/auth/disable-2fa');
  },
};
