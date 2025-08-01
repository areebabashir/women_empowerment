// src/utils/auth.ts
import { apiCall } from "@/api/apiCall";
import { User } from "@/types";


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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

export const isngoorCompany = async (): Promise<boolean> => {
  try {
    const response = await apiCall<{ user: User }>({
      url: `${API_BASE_URL}/users/profile`,
      method: 'GET',
      requiresAuth: true,
    });

    const role = response?.data?.role?.toLowerCase();

    console.log("roleee" , role)
    return role === 'ngo' || role === 'company';
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
};

// You can still keep the authUtils object if you want both approaches
export const authUtils = {
  isAuthenticated,
  getUserRole,
  getToken,
  logout,
  setAuth,
  isngoorCompany
};