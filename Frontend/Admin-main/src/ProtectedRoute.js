import React from 'react';
import { Navigate } from 'react-router-dom';

// Replace this with your actual authentication logic
const isAuthenticated = () => {
  // Example: check for a token in localStorage
  return !!localStorage.getItem('authToken');
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/Login" replace />;
  }
  return children;
};

export default ProtectedRoute; 