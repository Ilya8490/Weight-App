import { useState } from 'react';
import type { AuthResponse } from '@health-metrics/shared';
import { api } from '../lib/api';
import { useAppStore } from '../store/app-store';

interface Credentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const setUser = useAppStore((state) => state.setUser);
  const mode = useAppStore((state) => state.mode);
  const clearAuthenticatedSession = useAppStore((state) => state.clearAuthenticatedSession);
  const exitGuestMode = useAppStore((state) => state.exitGuestMode);

  const execute = async (path: string, body?: Credentials) => {
    setLoading(true);
    try {
      const response = await api<AuthResponse>(path, {
        method: path === '/auth/logout' ? 'POST' : path === '/auth/me' ? 'GET' : 'POST',
        body
      });
      setUser(response.user);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const register = (credentials: Credentials) => execute('/auth/register', credentials);
  const login = (credentials: Credentials) => execute('/auth/login', credentials);
  const logout = async () => {
    if (mode === 'guest') {
      exitGuestMode();
      return;
    }

    setLoading(true);
    try {
      try {
        await api<{ success: true }>('/auth/logout', { method: 'POST' });
      } finally {
        clearAuthenticatedSession();
      }
    } finally {
      setLoading(false);
    }
  };
  const me = async () => {
    setLoading(true);
    try {
      const response = await api<AuthResponse>('/auth/me', { method: 'GET' });
      setUser(response.user);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    register,
    login,
    logout,
    me
  };
};
