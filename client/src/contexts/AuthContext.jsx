import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { AuthContext } from './authContext.js';

const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setAdmin(data.admin);
      } catch {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setAdmin(data.admin);
    return data.admin;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
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
