'use client';

import { requestApi } from '../index';

export interface PrivacyPolicy {
  id?: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

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

export const getPrivacyPolicysApi = async (): Promise<ApiResponse<PrivacyPolicy[]>> => {
  return await requestApi({
    url: '/privacy-policy',
    method: 'GET',
    successMessage: 'Privacy Policy fetched successfully!',
  });
};

export const getTermsApi = async (): Promise<ApiResponse<TermCondition[]>> => {
  return await requestApi({
    url: '/term-condition',
    method: 'GET',
    successMessage: 'Terms & Conditions fetched successfully!',
  });
};
