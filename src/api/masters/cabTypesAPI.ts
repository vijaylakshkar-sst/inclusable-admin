'use client';

import { requestApi } from '../index';

// ==============================
// CAB TYPE INTERFACE (UPDATED)
// ==============================
export interface CabType {
  id?: number;
  name: string;
  standard_price: string;
  disability_feature_price: string;
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
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
// GET ALL CAB TYPES
// ==============================
export const getCabTypesApi = async (): Promise<ApiResponse<CabType[]>> => {
  return await requestApi({
    url: '/admin/cab-types',
    method: 'GET',
    successMessage: 'Cab types fetched successfully!',
  });
};

// ==============================
// GET CAB TYPE BY ID
// ==============================
export const getCabTypeByIdApi = async (
  id: number
): Promise<ApiResponse<CabType>> => {
  return await requestApi({
    url: `/admin/cab-types/${id}`,
    method: 'GET',
  });
};

// ==============================
// CREATE CAB TYPE
// ==============================
export const createCabTypeApi = async (
  formData: FormData
): Promise<ApiResponse<CabType>> => {
  return await requestApi({
    url: '/admin/cab-types',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    successMessage: 'Cab type created successfully!',
  });
};

// ==============================
// UPDATE CAB TYPE
// ==============================
export const updateCabTypeApi = async (
  id: number,
  formData: FormData
): Promise<ApiResponse<CabType>> => {
  return await requestApi({
    url: `/admin/cab-types/${id}`,
    method: 'PUT',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    successMessage: 'Cab type updated successfully!',
  });
};

// ==============================
// DELETE CAB TYPE
// ==============================
export const deleteCabTypeApi = async (
  id: number
): Promise<ApiResponse<string>> => {
  return await requestApi({
    url: `/admin/cab-types/${id}`,
    method: 'DELETE',
    successMessage: 'Cab type deleted successfully!',
  });
};
