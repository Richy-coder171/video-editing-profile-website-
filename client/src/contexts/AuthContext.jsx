import { useEffect, useMemo, useState } from 'react';
import { api, clearToken, saveToken, TOKEN_KEY } from '../services/api.js';
import { AuthContext } from './authContext.js';

const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    const bootstrap = async () => {
      if (!localStorage.getItem(TOKEN_KEY)) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setAdmin(data.admin);
      } catch {
        clearToken();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    saveToken(data.token);
    setAdmin(data.admin);
    return data.admin;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearToken();
      setAdmin(null);
    }
  };

  const value = useMemo(
    () => ({
      admin,
      loading,
      isAuthenticated: Boolean(admin),
      login,
      logout
    }),
    [admin, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
