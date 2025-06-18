import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, API_URL } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  becomeHost: () => Promise<void>;
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
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token found:', !!token);
      
      if (!token) {
        setLoading(false);
        return;
      }

      console.log('Calling auth.getMe()...');
      const response = await auth.getMe();
      console.log('getMe response:', response);
      
      if (response.success) {
        setUser(response.data);
        console.log('User set:', response.data);
      } else {
        console.log('getMe failed:', response.error);
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      console.error('Error loading user:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      console.log('Sending login request to:', `${API_URL}/auth/login`);
      const response = await auth.login({ email, password });
      console.log('Login response:', response);
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        // Get user data from the /me endpoint
        const userResponse = await auth.getMe();
        if (userResponse.success) {
          setUser(userResponse.data);
          console.log('User logged in successfully:', userResponse.data);
        } else {
          throw new Error('Failed to get user data');
        }
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      setError(err.response?.data?.error || 'An error occurred during login');
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      const response = await auth.register({ name, email, password });
      if (response.success) {
        // Don't automatically log in after registration
        return;
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'An error occurred during registration');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const becomeHost = async () => {
    try {
      setError(null);
      const response = await auth.becomeHost();
      if (response.success) {
        // Update the user state with the new role
        setUser(response.data);
        navigate('/host/dashboard');
      } else {
        throw new Error(response.error || 'Failed to become a host');
      }
    } catch (err: any) {
      console.error('Become host error:', err);
      setError(err.response?.data?.error || 'An error occurred while becoming a host');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    becomeHost,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 