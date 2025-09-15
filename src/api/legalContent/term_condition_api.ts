'use client';

import { requestApi } from '../index';

export interface TermCondition {
  id?: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}

// List all Terms & Conditions
export const getTermsApi = async (): Promise<ApiResponse<TermCondition[]>> => {
  return await requestApi({
    url: '/admin/terms-conditions',
    method: 'GET',
    successMessage: 'Terms & Conditions fetched successfully!',
  });
};

// Get single Term & Condition by ID
export const getTermByIdApi = async (id: number): Promise<ApiResponse<TermCondition>> => {
  return await requestApi({
    url: `/admin/terms-conditions/${id}`,
    method: 'GET',
  });
};

// Create Term & Condition
export const createTermApi = async (data: TermCondition): Promise<ApiResponse<TermCondition>> => {
  return await requestApi({
    url: '/admin/terms-conditions',
    method: 'POST',
    data,
    successMessage: 'Term & Condition created successfully!',
  });
};

// Update Term & Condition
export const updateTermApi = async (id: number, data: TermCondition): Promise<ApiResponse<TermCondition>> => {
  return await requestApi({
    url: `/admin/terms-conditions/${id}`,
    method: 'PUT',
    data,
    successMessage: 'Term & Condition updated successfully!',
  });
};

// Delete Term & Condition
export const deleteTermApi = async (id: number): Promise<ApiResponse<string>> => {
  return await requestApi({
    url: `/admin/terms-conditions/${id}`,
    method: 'DELETE',
    successMessage: 'Term & Condition deleted successfully!',
  });
};
