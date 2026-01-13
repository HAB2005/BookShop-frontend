import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getAuthData, clearAuthData, isAuthenticated } from '../shared/lib/auth.js';
import { useToast } from '../shared/hooks/useToast';
import ToastContainer from '../shared/ui/ToastContainer';

// Auth Context
const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const authData = getAuthData();
      if (authData) {
        setUser(authData.user);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
    updateUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Layout Context
const LayoutContext = createContext();

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

export const LayoutProvider = ({ children }) => {
  const [pageTitle, setPageTitle] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const updateLayout = useCallback(({ title, breadcrumbs: newBreadcrumbs }) => {
    if (title) setPageTitle(title);
    if (newBreadcrumbs) setBreadcrumbs(newBreadcrumbs);
  }, []);

  return (
    <LayoutContext.Provider value={{
      pageTitle,
      breadcrumbs,
      updateLayout,
      setPageTitle,
      setBreadcrumbs
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

// Toast Context
const ToastContext = createContext();

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </ToastContext.Provider>
  );
};