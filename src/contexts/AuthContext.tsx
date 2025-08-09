import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import { permissionsService, ModulePermission } from '../services/permissionsService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  userType: number | null;
  permissions: ModulePermission[];
  login: (token: string, userData: any) => void;
  logout: () => void;
  fetchUserPermissions: () => Promise<void>;
  hasPermission: (moduleName: string, action: 'view' | 'create' | 'edit' | 'delete' | 'export') => boolean;
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
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [userType, setUserType] = useState<number | null>(null);
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);

  const fetchUserPermissions = async () => {
    if (!userType) return;
    
    try {
      const userPermissions = await permissionsService.getUserPermissions(userType);
      setPermissions(userPermissions);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      // Set default permissions or handle error appropriately
      setPermissions([]);
    }
  };

  const hasPermission = (moduleName: string, action: 'view' | 'create' | 'edit' | 'delete' | 'export'): boolean => {
    return permissionsService.hasPermission(permissions, moduleName, action);
  };

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = apiService.getAuthToken();
    const userData = localStorage.getItem('userData');
    const storedUserType = localStorage.getItem('userType');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
        
        // Set user type from localStorage or from user data
        if (storedUserType) {
          setUserType(parseInt(storedUserType));
        } else if (parsedUser.user_type) {
          setUserType(parsedUser.user_type);
          localStorage.setItem('userType', parsedUser.user_type.toString());
        }
      } catch (error) {
        // Invalid user data, clear everything
        apiService.clearAuthToken();
        setIsAuthenticated(false);
        setUser(null);
        setUserType(null);
        setPermissions([]);
      }
    }
  }, []);

  // Fetch permissions when user type changes
  useEffect(() => {
    if (userType && isAuthenticated) {
      fetchUserPermissions();
    }
  }, [userType, isAuthenticated]);

  const login = (token: string, userData: any) => {
    console.log('AuthContext login called with token:', token);
    apiService.setAuthToken(token);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Set user type
    const userTypeValue = userData.user_type || 4; // Default to admin (4)
    setUserType(userTypeValue);
    localStorage.setItem('userType', userTypeValue.toString());
    
    setIsAuthenticated(true);
    setUser(userData);
    console.log('AuthContext login completed, isAuthenticated set to true');
  };

  const logout = () => {
    // Clear auth token and user data
    apiService.clearAuthToken();
    // Clear all localStorage to ensure complete logout
    localStorage.clear();
    // Reset authentication state
    setIsAuthenticated(false);
    setUser(null);
    setUserType(null);
    setPermissions([]);
  };

  const value = {
    isAuthenticated,
    user,
    userType,
    permissions,
    login,
    logout,
    fetchUserPermissions,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 