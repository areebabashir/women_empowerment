// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface TokenData {
  exp?: number;
  [key: string]: any;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  // Check if token exists and is not expired (optional: add token validation)
  if (!token) {
    // Redirect to sign-in page if no token
    return <Navigate to="/login" replace />;
  }

  // Optional: Add token expiration check
  try {
    // Decode JWT token to check expiration (basic check)
    const tokenData: TokenData = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (tokenData.exp && tokenData.exp < currentTime) {
      // Token is expired, remove it and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // Invalid token format, remove it and redirect
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;