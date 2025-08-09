import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Determine if this is admin login route
  const isAdminLogin = location.pathname === '/admin';
  
  // Helper to safely extract organizationId from various possible response shapes
  const getOrganizationId = (source: any) => {
    if (!source) return null;
    return source.organizationId ?? source.organization_id ?? source.orgId ?? null;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Determine user_type based on route
    const userType = isAdminLogin ? 4 : 2; // 4 for admin, 2 for regular user
    
    try {
      const data = await apiService.login({
        user_type: userType,
        email: email,
        password: password
      });
      console.log('API Response:', data);
      console.log('API Response data property:', data.data);
      console.log('Token from response:', data?.data?.token);
      console.log('User from response:', data?.data?.user);
      
      // Store the token and user data
      if (data?.data?.token) {  
        console.log('Login successful, calling login function with token:', data.data.token);
        const rawUser = data.data.user || {};
        const enhancedUser = isAdminLogin
          ? rawUser
          : {
              ...rawUser,
              organizationId: getOrganizationId(rawUser) ?? getOrganizationId(data.data) ?? getOrganizationId(data)
            };
        login(data.data.token, enhancedUser);
        console.log('Login function called, navigating to dashboard');
        // Force navigation to dashboard
        window.location.href = '/dashboard';
      } else if (data?.token) {
        // Fallback for direct token structure
        console.log('Login successful (fallback), calling login function with token:', data.token);
        const rawUser = data.user || {};
        const enhancedUser = isAdminLogin
          ? rawUser
          : {
              ...rawUser,
              organizationId: getOrganizationId(rawUser) ?? getOrganizationId(data)
            };
        login(data.token, enhancedUser);
        console.log('Login function called, navigating to dashboard');
        window.location.href = '/dashboard';
      } else {
        console.log('No token received from API');
        setError('Login failed: No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left side - Illustration */}
        <div className="login-illustration">
          <div className="illustration-content">
            <div className="logo-container">
              <div className="logo">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="12" fill="#1E40AF"/>
                  <path d="M15 20L30 10L45 20V50H15V20Z" fill="white"/>
                  <rect x="25" y="30" width="10" height="20" fill="#1E40AF"/>
                  <circle cx="30" cy="20" r="3" fill="#1E40AF"/>
                </svg>
              </div>
              <h2 className="company-name">VHubX</h2>
            </div>
            <div className="illustration-man">
              <div className="man-figure">
                <div className="man-head"></div>
                <div className="man-body"></div>
                <div className="man-arms"></div>
                <div className="man-legs"></div>
              </div>
              <div className="door">
                <div className="door-panels"></div>
                <div className="door-handle"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="login-form">
          <div className="form-header">
            <h1 className="login-title">
              {isAdminLogin ? 'Welcome to Admin Dashboard' : 'Welcome to Dashboard'}
            </h1>
            <p className="login-subtitle">
              {isAdminLogin ? 'Access your admin panel' : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form-content">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-actions">
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
            
            {/* Debug button for testing */}
            {/* <button 
              type="button" 
              className="btn btn-secondary mt-2" 
              onClick={() => {
                console.log('Debug: Manual login test');
                login('test-token', { id: 1, name: 'Test User', email: 'test@example.com' });
                window.location.href = '/dashboard';
              }}
            >
              Debug: Test Login
            </button>

            <div className="signup-link">
              <span>Don't have an account? </span>
              <a href="#" className="signup-text">Sign up</a>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 