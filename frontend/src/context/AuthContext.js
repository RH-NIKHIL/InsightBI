import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const savedUser = localStorage.getItem('insightbi_user');
    const savedToken = localStorage.getItem('insightbi_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setUser(data.user);
    localStorage.setItem('insightbi_user', JSON.stringify(data.user));
    localStorage.setItem('insightbi_token', data.token);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await authAPI.register(name, email, password);
    setUser(data.user);
    localStorage.setItem('insightbi_user', JSON.stringify(data.user));
    localStorage.setItem('insightbi_token', data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('insightbi_user');
    localStorage.removeItem('insightbi_token');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
