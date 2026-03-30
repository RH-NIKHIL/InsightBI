import React, { createContext, useContext, useState, useEffect } from 'react';

const StaffAuthContext = createContext();

export const useStaffAuth = () => useContext(StaffAuthContext);

const API_BASE = 'http://localhost:5000/api';

export const StaffAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('insightbi_staff_token');
    const savedUser = localStorage.getItem('insightbi_staff_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE}/staff-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('insightbi_staff_token', data.token);
    localStorage.setItem('insightbi_staff_user', JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('insightbi_staff_token');
    localStorage.removeItem('insightbi_staff_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <StaffAuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </StaffAuthContext.Provider>
  );
};
