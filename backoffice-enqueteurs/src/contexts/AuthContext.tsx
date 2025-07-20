import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginDto, AuthResponse } from '@/types/api';
import { apiService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && apiService.isAuthenticated();

  useEffect(() => {
    const initAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const userData = await apiService.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          apiService.logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginDto): Promise<void> => {
    try {
      setIsLoading(true);
      const authResponse: AuthResponse = await apiService.loginFromScratch(credentials);
      
      // Récupérer les informations du profil utilisateur
      const userData = await apiService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    if (apiService.isAuthenticated()) {
      try {
        const userData = await apiService.getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Erreur lors du rafraîchissement du profil:', error);
        logout();
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};