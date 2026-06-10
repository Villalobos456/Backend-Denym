// src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || '/api';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(() => { try { return JSON.parse(localStorage.getItem('ds_user')); } catch { return null; } });
  const [token, setToken] = useState(() => localStorage.getItem('ds_token') || null);

  const login = useCallback(async (credentials) => {
    const { data } = await axios.post(`${API}/auth/login`, credentials);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('ds_user',  JSON.stringify(data.user));
    localStorage.setItem('ds_token', data.token);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(`${API}/auth/logout`, { userId: user?.user_id, username: user?.username });
    } catch {}
    setUser(null); setToken(null);
    localStorage.removeItem('ds_user');
    localStorage.removeItem('ds_token');
  }, [user]);

  const register = useCallback(async (data) => {
    const res = await axios.post(`${API}/auth/register`, data);
    return res.data;
  }, []);

  const isAdmin    = user?.role_name === 'admin' || user?.role_name === 'vendedor';
  const isLoggedIn = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, isLoggedIn, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
