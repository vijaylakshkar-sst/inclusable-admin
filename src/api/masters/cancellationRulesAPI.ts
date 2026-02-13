'use client';

import { requestApi } from '../index';

// ==============================
// CANCELLATION RULE INTERFACE
// ==============================
export interface CancellationRule {
  id?: number;
  deduction_percentage: string;        // DECIMAL from backend
  minimum_deduction_amount: string;    // DECIMAL from backend
  active: boolean;
  created_at?: string;
}

// ==============================
// GENERIC API RESPONSE
// ==============================
export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message?: string;
}

// ==============================
// GET ALL CANCELLATION RULES
// ==============================
export const getCancellationRulesApi = async (): Promise<
  ApiResponse<CancellationRule[]>
> => {
  return await requestApi({
    url: '/admin/cancellation-rules',
    method: 'GET',
    // successMessage: 'Cancellation rules fetched successfully!',
  });
};

// ==============================
// GET CANCELLATION RULE BY ID
// ==============================
export const getCancellationRuleByIdApi = async (
  id: number
): Promise<ApiResponse<CancellationRule>> => {
  return await requestApi({
    url: `/admin/cancellation-rules/${id}`,
    method: 'GET',
  });
};

// ==============================
// CREATE CANCELLATION RULE
// ==============================
export const createCancellationRuleApi = async (
  payload: {
    deduction_percentage: string | number;
    minimum_deduction_amount: string | number;
    active?: boolean;
  }
): Promise<ApiResponse<CancellationRule>> => {
  return await requestApi({
    url: '/admin/cancellation-rules',
    method: 'POST',
    data: payload,
    successMessage: 'Cancellation rule created successfully!',
  });
};

// ==============================
// UPDATE CANCELLATION RULE
// ==============================
export const updateCancellationRuleApi = async (
  id: number,
  payload: {
    deduction_percentage?: string | number;
    minimum_deduction_amount?: string | number;
    active?: boolean;
  }
): Promise<ApiResponse<CancellationRule>> => {
  return await requestApi({
    url: `/admin/cancellation-rules/${id}`,
    method: 'PUT',
    data: payload,
    successMessage: 'Cancellation rule updated successfully!',
  });
};

// ==============================
// DELETE CANCELLATION RULE
// ==============================
export const deleteCancellationRuleApi = async (
  id: number
): Promise<ApiResponse<string>> => {
  return await requestApi({
    url: `/admin/cancellation-rules/${id}`,
    method: 'DELETE',
    successMessage: 'Cancellation rule deleted successfully!',
  });
};
