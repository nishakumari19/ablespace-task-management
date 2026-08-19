'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  title?: string;
  avatar?: string;
  isGuest?: boolean;
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
}

interface AuthContextType {
  user: User | null;
  workspace: Workspace | null;
  token: string | null;
  isLoading: boolean;
  guestLogin: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedWs = localStorage.getItem('workspace');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      if (savedWs) setWorkspace(JSON.parse(savedWs));
    }
    setIsLoading(false);
  }, []);

  const guestLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/guest-login');
      const { accessToken, user, workspace } = res.data;

      setToken(accessToken);
      setUser(user);
      setWorkspace(workspace);

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('workspace', JSON.stringify(workspace));
    } catch (error) {
      console.error('Guest login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const res = await api.patch('/users/me', data);
      const updatedUser = res.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setWorkspace(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('workspace');
  };

  return (
    <AuthContext.Provider
      value={{ user, workspace, token, isLoading, guestLogin, updateProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
