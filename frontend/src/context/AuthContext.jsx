import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData, userType) => {
    try {
      const response = await axios.post(`/api/auth/register/${userType}`, userData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Login user
  const login = async (email, password, userType) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
        userType,
      });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Set authorization header for axios
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Set auth token on initial load
  useEffect(() => {
    if (user && user.token) {
      setAuthToken(user.token);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 