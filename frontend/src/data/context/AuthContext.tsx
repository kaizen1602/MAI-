/**
 * AuthContext.tsx
 * 
 * React Context for managing global authentication state.
 * Provides authentication state and methods to all components.
 * 
 * Principios SOLID aplicados:
 * - Single Responsibility: Solo maneja el estado de autenticación
 * - Dependency Inversion: Los componentes dependen del contexto, no del servicio directamente
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services';
import type { User, LoginRequest, RegisterRequest } from '../types/auth.types';

/**
 * Interface del contexto de autenticación
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User> | FormData) => Promise<void>;
  refreshUser: () => Promise<void>;
}

/**
 * Contexto de autenticación
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props del proveedor
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Proveedor del contexto de autenticación
 * Debe envolver la aplicación en el nivel superior
 * 
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Inicializa el estado de autenticación al montar el componente
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Verificar si hay token y usuario guardados
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          
          if (currentUser) {
            setUser(currentUser);
            
            // Intentar refrescar el perfil desde el servidor
            try {
              const profile = await authService.getProfile();
              setUser(profile);
            } catch (error) {
              // Si falla, el token podría estar expirado
              console.error('Error refreshing profile:', error);
              authService.logout();
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Inicia sesión con credenciales
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registra un nuevo usuario
   */
  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cierra sesión
   */
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      // Incluso si falla, limpiar el estado local
      console.error('Error during logout:', error);
      authService.logout(); // Limpia localStorage
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Actualiza el perfil del usuario
   */
  const updateProfile = async (data: Partial<User> | FormData): Promise<void> => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresca los datos del usuario desde el servidor
   */
  const refreshUser = async (): Promise<void> => {
    try {
      const updatedUser = await authService.getProfile();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personalizado para usar el contexto de autenticación
 * 
 * @throws Error si se usa fuera del AuthProvider
 * 
 * @example
 * function MyComponent() {
 *   const { user, login, logout } = useAuth();
 *   
 *   if (!user) {
 *     return <LoginForm onSubmit={login} />;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Welcome {user.name}</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

/**
 * Hook para requerir autenticación
 * Redirige al login si no está autenticado
 * 
 * @example
 * function ProtectedPage() {
 *   const { user } = useRequireAuth();
 *   
 *   // Solo se renderiza si hay usuario autenticado
 *   return <div>Protected content for {user.name}</div>;
 * }
 */
export const useRequireAuth = (): AuthContextType => {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirigir al login
      window.location.href = '/login';
    }
  }, [auth.isAuthenticated, auth.isLoading]);
  
  return auth;
};
