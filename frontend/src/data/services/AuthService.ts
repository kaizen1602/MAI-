/**
 * Authentication Service
 *
 * Handles all authentication-related operations:
 * - Login
 * - Register
 * - Logout
 * - Profile management
 * - Token management
 *
 * Following Single Responsibility Principle (SOLID)
 */

import { BaseService } from "./base/BaseService";
import { ENDPOINTS } from "../api/endpoints";
import { TOKEN_KEY, USER_KEY } from "../api/interceptors";
import {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  AuthResponse,
  ProfileResponse,
  User,
} from "../types/auth.types";

// Type for forgot password response
interface ForgotPasswordResponse {
  message: string;
  reset_token?: string; // Opcional, ya que puede no estar presente en todos los casos
}

// Type for reset password request
interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Type for reset password response
interface ResetPasswordResponse {
  message: string;
}

// Type for change password request
interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// Type for change password response
interface ChangePasswordResponse {
  message: string;
}

class AuthService extends BaseService {
  /**
   * Login user
   *
   * @param credentials - Email and password
   * @returns Auth response with user and token
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.handleRequest<AuthResponse>(
      this.client.post(ENDPOINTS.AUTH.LOGIN, credentials)
    );

    // Store token and user in localStorage
    this.storeAuthData(response);

    return response;
  }

  /**
   * Register new user
   *
   * @param data - Registration data
   * @returns Auth response with user and token
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.handleRequest<AuthResponse>(
      this.client.post(ENDPOINTS.AUTH.REGISTER, data)
    );

    // Store token and user in localStorage
    this.storeAuthData(response);

    return response;
  }

  /**
   * Request password reset
   *
   * @param email - User's email
   * @returns Success message
   */
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const response = await this.handleRequest<ForgotPasswordResponse>(
      this.client.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
    );

    return response;
  }

  /**
   * Reset password with token
   *
   * @param data - Reset password data
   * @returns Success message
   */
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    const response = await this.handleRequest<ResetPasswordResponse>(
      this.client.post(ENDPOINTS.AUTH.RESET_PASSWORD, data)
    );

    return response;
  }

  /**
   * Get current user profile
   *
   * @returns User profile data
   */
  async getProfile(): Promise<User> {
    const response = await this.handleRequest<ProfileResponse>(
      this.client.get(ENDPOINTS.AUTH.PROFILE)
    );

    // Update user in localStorage
    this.storeUser(response.user);

    return response.user;
  }

  /**
   * Update user profile
   *
   * @param data - Profile data to update (can be object or FormData)
   * @returns Updated user data
   */
  async updateProfile(data: UpdateProfileRequest | FormData): Promise<User> {
    const response = await this.handleRequest<ProfileResponse>(
      this.client.post(ENDPOINTS.AUTH.PROFILE, data, {
        headers:
          data instanceof FormData
            ? {
                "Content-Type": "multipart/form-data",
              }
            : {
                "Content-Type": "application/json",
              },
      })
    );

    // Update user in localStorage
    this.storeUser(response.user);

    return response.user;
  }

  /**
   * Logout current session
   */
  async logout(): Promise<void> {
    try {
      await this.handleRequest(this.client.post(ENDPOINTS.AUTH.LOGOUT));
    } finally {
      // Always clear local data, even if request fails
      this.clearAuthData();
    }
  }

  /**
   * Logout all sessions
   */
  async logoutAll(): Promise<void> {
    try {
      await this.handleRequest(this.client.post(ENDPOINTS.AUTH.LOGOUT_ALL));
    } finally {
      // Always clear local data, even if request fails
      this.clearAuthData();
    }
  }

  /**
   * Change user password
   *
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @param confirmPassword - New password confirmation
   * @returns Success message
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ChangePasswordResponse> {
    const data: ChangePasswordRequest = {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    };

    const response = await this.handleRequest<ChangePasswordResponse>(
      this.client.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, data)
    );

    return response;
  }

  // ==========================================
  // Helper Methods
  // ==========================================

  /**
   * Store authentication data in localStorage
   *
   * @param authData - Auth response from server
   */
  private storeAuthData(authData: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, authData.access_token);
    this.storeUser(authData.user);
  }

  /**
   * Store user data in localStorage
   *
   * @param user - User object
   */
  private storeUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear all authentication data from localStorage
   */
  private clearAuthData(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Check if user is authenticated
   *
   * @returns True if token exists
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get current user from localStorage
   *
   * @returns User object or null
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as User;
    } catch (error) {
      console.error("Failed to parse user data:", error);
      return null;
    }
  }

  /**
   * Get authentication token
   *
   * @returns Token string or null
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Check if current user is admin
   *
   * @returns True if user is admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.is_admin === true;
  }
}

// Export singleton instance
export default new AuthService();
