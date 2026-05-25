import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null); // { message, type: 'success' | 'error' | 'warning' | 'info' }

  // Global Alert Manager
  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  // Sync session on mount
  useEffect(() => {
    const syncSession = async () => {
      const storedToken = localStorage.getItem('hcl_auth_token');
      const storedUser = localStorage.getItem('hcl_current_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Asynchronous profile synchronization
        try {
          const freshUser = await userService.getMe();
          setUser(freshUser);
          localStorage.setItem('hcl_current_user', JSON.stringify(freshUser));
        } catch (err) {
          console.warn('Session verification failed, logging out:', err);
          // If the verification throws (e.g. blocked or expired), clear auth state
          localStorage.removeItem('hcl_auth_token');
          localStorage.removeItem('hcl_current_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    syncSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      setToken(data.token);
      setUser(data.user);
      showAlert(`Welcome back, ${data.user.name}!`, 'success');
      return data.user;
    } catch (err) {
      showAlert(err.message || 'Login failed. Please check credentials.', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register({ name, email, password });
      setToken(data.token);
      setUser(data.user);
      showAlert(`Welcome to HCL Hotels, ${data.user.name}! Your account is registered.`, 'success');
      return data.user;
    } catch (err) {
      showAlert(err.message || 'Registration failed.', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      showAlert('Logged out successfully.', 'info');
    } catch (err) {
      console.warn('Backend logout failed/unavailable.');
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    if (!user) return;
    try {
      const updatedUser = await userService.updateProfile(user.id, profileData);
      setUser(updatedUser);
      showAlert('Profile details updated successfully.', 'success');
      return updatedUser;
    } catch (err) {
      showAlert(err.message || 'Profile update failed.', 'error');
      throw err;
    }
  };

  const value = {
    user,
    token,
    loading,
    alert,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'ADMIN',
    showAlert,
    hideAlert,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
