import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('drivero_admin_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      const savedToken = localStorage.getItem('drivero_admin_token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.getAdminMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session expired or invalid token');
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    verifyAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.loginAdmin(credentials);
    if (res.success && res.token) {
      localStorage.setItem('drivero_admin_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } else {
      throw new Error(res.message || 'Invalid admin credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('drivero_admin_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
