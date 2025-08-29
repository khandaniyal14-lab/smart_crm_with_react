import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import api from '../services/api'; // Axios instance

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{
    access_token: string;
    user: User;
  }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      api.get('/v1/endpoints/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('authToken');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);


  interface LoginResponse {
  access_token: string;
  user: User;
}

const login = async (email: string, password: string): Promise<LoginResponse> => {
  setLoading(true);
  try {
    const res = await api.post('/v1/endpoints/auth/login', { email, password });
    const user: User = res.data.user;
    const access_token: string = res.data.access_token;

    localStorage.setItem('authToken', access_token);
    setUser(user);

    return { access_token, user };
  } catch (err) {
    console.error('Login failed', err);
    throw err;
  } finally {
    setLoading(false);
  }
};



  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
