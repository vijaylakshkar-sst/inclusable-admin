'use client';

import { requestApi } from '../index';

export interface SupportTicket {
  id?: number;
  user_id?: number;
  subject: string;
  message: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}

// List all Privacy Policy
export const getSupportTicktetApi = async (): Promise<ApiResponse<SupportTicket[]>> => {
  return await requestApi({
    url: '/admin/support-tickets',
    method: 'GET',
    // successMessage: 'Support Tickets fetched successfully!',
  });
};

export const updateStatus = async (id: number, data: SupportTicket): Promise<ApiResponse<SupportTicket>> => {
  return await requestApi({
    url: `/admin/support-tickets/${id}/status`,
    method: 'PUT',
    data,
    successMessage: 'Support Tickets status updated successfully!',
  });
};