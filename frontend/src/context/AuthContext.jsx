import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('studenthub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('studenthub_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password, rememberMe) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password, rememberMe });
      if (res.success && res.data) {
        const { token: jwtToken, ...userData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('studenthub_token', jwtToken);
        localStorage.setItem('studenthub_user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      return { success: false, error: err.toString() };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('studenthub_token');
    localStorage.removeItem('studenthub_user');
  };

  const updateUser = (updatedFields) => {
    setUser(prev => {
      const newU = { ...prev, ...updatedFields };
      localStorage.setItem('studenthub_user', JSON.stringify(newU));
      return newU;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'ROLE_ADMIN',
        isStudent: user?.role === 'ROLE_STUDENT',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
