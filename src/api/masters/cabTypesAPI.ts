'use client';

import { requestApi } from '../index';

export interface CabType {
  id?: number;
  name: string;
  category: string;
  thumbnail: string;
  fare_per_km: string;
  seating_capacity: string;
  luggage_capacity: string;
  description: string;
  created_at?: string;  
  updated_at?: string;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}

// List all Cab Type
export const getCabTypesApi = async (): Promise<ApiResponse<CabType[]>> => {
  return await requestApi({
    url: '/admin/cab-types',
    method: 'GET',
    successMessage: 'Cab Type fetched successfully!',
  });
};

// Get single Cab Type by ID
export const getCabTypeByIdApi = async (id: number): Promise<ApiResponse<CabType>> => {
  return await requestApi({
    url: `/admin/cab-types/${id}`,
    method: 'GET',
  });
};

// Create Cab Type
export const createCabTypeApi = async (formData: FormData): Promise<ApiResponse<CabType>> => {
  return await requestApi({
    url: '/admin/cab-types',
    method: 'POST',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    successMessage: 'Cab Type created successfully!',
  });
};

// Update Cab Type
export const updateCabTypeApi = async (id: number, formData: FormData): Promise<ApiResponse<CabType>> => {
  return await requestApi({
    url: `/admin/cab-types/${id}`,
    method: 'PUT',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    successMessage: 'Cab Type updated successfully!',
  });
};

// Delete Cab Type
export const deleteCabTypeApi = async (id: number): Promise<ApiResponse<string>> => {
  return await requestApi({
    url: `/admin/cab-types/${id}`,
    method: 'DELETE',
    successMessage: 'Cab Type deleted successfully!',
  });
};
