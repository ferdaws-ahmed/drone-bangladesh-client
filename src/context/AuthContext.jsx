'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || null;

const clearStoredAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const binary = atob(padded);
    return JSON.parse(binary);
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload || payload.exp === undefined) return false;
  return Date.now() >= payload.exp * 1000;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      clearStoredAuth();
      setUser(null);
      setLoading(false);
      return;
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.email) {
          setUser(parsedUser);
        } else {
          clearStoredAuth();
          setUser(null);
        }
      } catch (err) {
        clearStoredAuth();
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  const redirectAfterLogin = (userData) => {
    if (userData.role === 'admin' && ADMIN_URL) {
      if (typeof window !== 'undefined') {
        window.location.href = ADMIN_URL;
        return;
      }
    }
    if (userData.role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password }, { auth: false });

      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        setUser(data.data.user);
        toast.success('Login successful!');
        redirectAfterLogin(data.data.user);
      } else {
        toast.error(data.message || 'Login failed');
      }
      return data;
    } catch (error) {
      toast.error('Server connection failed');
      return { success: false, message: 'Server connection failed.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await api.post('/auth/register', { name, email, password }, { auth: false });

      if (data.success) {
        toast.success('Registration successful!');
        const loginRes = await login(email, password);
        return loginRes;
      } else {
        toast.error(data.message || 'Registration failed');
      }
      return data;
    } catch (error) {
      toast.error('Server connection failed');
      return { success: false, message: 'Server connection failed.' };
    }
  };

  // Call this after a successful PUT /auth/me to keep React state + localStorage in sync
  const updateUser = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...patch };
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(merged));
      }
      return merged;
    });
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading, apiBase: api.base }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);