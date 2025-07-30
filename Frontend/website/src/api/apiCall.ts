import { ApiResponse, ApiCallOptions, ApiErrorResponse } from '../types';

export const apiCall = async <T = any>({ 
  url, 
  method = 'GET', 
  data = null as any, 
  requiresAuth = false 
}: ApiCallOptions): Promise<ApiResponse<T>> => {
  try {
    const headers: HeadersInit = {};

    // Don't set Content-Type for FormData - let browser set it with boundary
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Add authorization header if required
    if (requiresAuth) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      if (data instanceof FormData) {
        config.body = data;
      } else {
        config.body = JSON.stringify(data);
      }
    }

    const response = await fetch(url, config);
    const responseData = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: responseData,
        status: response.status
      };
    } else {
      return {
        success: false,
        data: responseData as ApiErrorResponse,
        status: response.status
      };
    }
  } catch (error: any) {
    return {
      success: false,
      data: { msg: 'Network error occurred' } as ApiErrorResponse,
      status: 0,
      error: error.message
    };
  }
};