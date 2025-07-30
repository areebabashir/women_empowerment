// src/utils/auth.ts

interface TokenData {
  exp: number;
  [key: string]: any;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const tokenData: TokenData = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return tokenData.exp > currentTime;
  } catch {
    return false;
  }
};

// Get user role
export const getUserRole = (): string | null => {
  return localStorage.getItem('userRole');
};

// Get auth token
export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('rememberMe');
  localStorage.removeItem('userEmail');
  window.location.href = '/login';
};

// Set authentication data
export const setAuth = (token: string, role: string): void => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('userRole', role);
};

// You can still keep the authUtils object if you want both approaches
export const authUtils = {
  isAuthenticated,
  getUserRole,
  getToken,
  logout,
  setAuth
};