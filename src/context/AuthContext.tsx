import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  email: string;
  name: string;
  picture?: string;
}

import { setAnalyticsUserContext, clearAnalyticsUserContext } from '@/components/ui/AnalyticsTracker';
import { recordUserLogin } from '@/lib/blogStore';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (googleCredential: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on page mount
    const savedToken = localStorage.getItem('session_token');
    const savedUser = localStorage.getItem('user_profile');
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        setAnalyticsUserContext(parsedUser.email, parsedUser.name);
      } catch (e) {
        console.error('Failed to parse saved session:', e);
        localStorage.removeItem('session_token');
        localStorage.removeItem('user_profile');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (googleCredential: string): Promise<boolean> => {
    try {
      // Decode Google JWT payload client-side to get user's profile details
      const base64Url = googleCredential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      if (payload && payload.email) {
        const userProfile: UserProfile = {
          email: payload.email,
          name: payload.name || '',
          picture: payload.picture || '',
        };

        setToken(googleCredential);
        setUser(userProfile);
        localStorage.setItem('session_token', googleCredential);
        localStorage.setItem('user_profile', JSON.stringify(userProfile));
        setAnalyticsUserContext(userProfile.email, userProfile.name);
        recordUserLogin(userProfile.email, userProfile.name, userProfile.picture, 'google');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google token decoding failed:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_profile');
    clearAnalyticsUserContext();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
