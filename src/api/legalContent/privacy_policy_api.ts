'use client';

import { requestApi } from '../index';

export interface PrivacyPolicy {
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

// List all Privacy Policy
export const getPrivacyPolicysApi = async (): Promise<ApiResponse<PrivacyPolicy[]>> => {
  return await requestApi({
    url: '/admin/privacy-policy',
    method: 'GET',
    // successMessage: 'Privacy Policy fetched successfully!',
  });
};

// Get single Privacy Policy by ID
export const getPrivacyPolicyByIdApi = async (id: number): Promise<ApiResponse<PrivacyPolicy>> => {
  return await requestApi({
    url: `/admin/privacy-policy/${id}`,
    method: 'GET',
  });
};

// Create Privacy Policy
export const createPrivacyPolicyApi = async (data: PrivacyPolicy): Promise<ApiResponse<PrivacyPolicy>> => {
  return await requestApi({
    url: '/admin/privacy-policy',
    method: 'POST',
    data,
    successMessage: 'Privacy Policy created successfully!',
  });
};

// Update Privacy Policy
export const updatePrivacyPolicyApi = async (id: number, data: PrivacyPolicy): Promise<ApiResponse<PrivacyPolicy>> => {
  return await requestApi({
    url: `/admin/privacy-policy/${id}`,
    method: 'PUT',
    data,
    successMessage: 'Privacy Policy updated successfully!',
  });
};

// Delete Privacy Policy
export const deletePrivacyPolicyApi = async (id: number): Promise<ApiResponse<string>> => {
  return await requestApi({
    url: `/admin/privacy-policy/${id}`,
    method: 'DELETE',
    successMessage: 'Privacy Policy deleted successfully!',
  });
};
