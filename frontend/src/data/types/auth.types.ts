/**
 * Authentication Types
 * 
 * TypeScript interfaces for authentication-related data
 */

/**
 * User model from Laravel
 */
export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address_details: string;
  profile_image?: string | null;
  is_verified: boolean;
  is_admin: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  role: {
    id: number;
    name: string;
  };
  department?: {
    id: number;
    name: string;
  } | null;
  municipality?: {
    id: number;
    name: string;
  } | null;
}

/**
 * Login Request Payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register Request Payload
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number: string;
  address_details: string;
  role_id: number;
  department_id?: number;
  municipality_id?: number;
}

/**
 * Update Profile Request Payload
 */
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  phone_number?: string;
  address_details?: string;
  profile_image?: File;
  role_id?: number;
  department_id?: number;
  municipality_id?: number;
}

/**
 * Authentication Response (Login/Register)
 */
export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string; // Usually "Bearer"
}

/**
 * Profile Response
 */
export interface ProfileResponse {
  user: User;
}

/**
 * Auth Context State
 */
export interface AuthContextState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  refreshUser: () => Promise<void>;
}
