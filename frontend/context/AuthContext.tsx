'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserResponse } from '@/types';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '@/lib/api';

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (u: string, p: string) => Promise<void>;
  signup: (u: string, e: string, p: string, fn?: string, ln?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const userData = await getCurrentUser();
        if (!ignore) setUser(userData);
      } catch {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch {
      setUser(null);
    }
  }, []);

  const login = async (u: string, p: string) => {
    setLoading(true);
    try {
      const res = await loginUser(u, p);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (u: string, e: string, p: string, fn?: string, ln?: string) => {
    setLoading(true);
    try {
      const res = await registerUser(u, e, p, fn, ln);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
