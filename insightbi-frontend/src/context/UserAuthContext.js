import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAuthAPI } from '../services/api';

const UserAuthContext = createContext();

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('insightbi_enduser');
    const savedToken = localStorage.getItem('insightbi_user_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await userAuthAPI.login(email, password);
    setUser(data.user);
    localStorage.setItem('insightbi_enduser', JSON.stringify(data.user));
    localStorage.setItem('insightbi_user_token', data.token);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await userAuthAPI.register(name, email, password);
    setUser(data.user);
    localStorage.setItem('insightbi_enduser', JSON.stringify(data.user));
    localStorage.setItem('insightbi_user_token', data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('insightbi_enduser');
    localStorage.removeItem('insightbi_user_token');
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
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};
