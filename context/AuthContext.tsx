'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Usuario, LoginCredentials, RegisterData, AuthContextType } from '@/types';
import { authAPI } from '@/services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Cargar token del localStorage al inicializar
  useEffect(() => {
    const storedToken = localStorage.getItem('craftica_token');
    const storedUser = localStorage.getItem('craftica_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(credentials);
      const { token: newToken, user: newUser } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('craftica_token', newToken);
      localStorage.setItem('craftica_user', JSON.stringify(newUser));
      
      setToken(newToken);
      setUser(newUser);
      
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      await authAPI.register(data);
      
      // Después del registro, hacer login automático
      await login({ correo: data.credencial.correo, password: data.credencial.password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('craftica_token');
    localStorage.removeItem('craftica_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};