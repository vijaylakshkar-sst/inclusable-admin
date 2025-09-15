'use client';

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Request interceptor to attach token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      // Ensure headers exists
      config.headers = config.headers || {};
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const message = (error.response.data as any)?.message || error.response.statusText;
      toast.error(`Error ${error.response.status}: ${message}`);
    } else if (error.request) {
      toast.error('No response from server. Please try again.');
    } else {
      toast.error(error.message);
    }
    return Promise.reject(error);
  }
);

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  url: string;
  method?: Method;
  data?: any;
  params?: any;
  successMessage?: string;
}

export const requestApi = async <T = any>({
  url,
  method = 'GET',
  data,
  params,
  successMessage,
}: RequestOptions): Promise<T> => {
  try {
    const response = await api.request<T>({
      url,
      method,
      data,
      params,
    });

    if (successMessage) toast.success(successMessage);

    return response.data;
  } catch (error) {
    // Error is already handled globally in interceptor
    throw error;
  }
};

export default api;
