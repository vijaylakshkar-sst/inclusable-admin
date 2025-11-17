'use client';

import { requestApi } from '../index';

export interface VehicleMake {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}

// 🧩 List all Vehicle Makes
export const getVehicleMakesApi = async (): Promise<ApiResponse<VehicleMake[]>> => {
  return await requestApi({
    url: '/admin/vehicle-makes',
    method: 'GET',
    successMessage: 'Vehicle makes fetched successfully!',
  });
};

// 🧩 Get single Vehicle Make by ID
export const getVehicleMakeByIdApi = async (id: number): Promise<ApiResponse<VehicleMake>> => {
  return await requestApi({
    url: `/admin/vehicle-makes/${id}`,
    method: 'GET',
  });
};

// 🧩 Create Vehicle Make
export const createVehicleMakeApi = async (formData: FormData): Promise<ApiResponse<VehicleMake>> => {
  return await requestApi({
    url: '/admin/vehicle-makes',
    method: 'POST',
    data: formData,
    headers: { 'Content-Type': 'application/json' },
    successMessage: 'Vehicle make created successfully!',
  });
};

// 🧩 Update Vehicle Make
export const updateVehicleMakeApi = async (
  id: number,
  formData: FormData
): Promise<ApiResponse<VehicleMake>> => {
  return await requestApi({
    url: `/admin/vehicle-makes/${id}`,
    method: 'PUT',
    data: formData,
    headers: { 'Content-Type': 'application/json' },
    successMessage: 'Vehicle make updated successfully!',
  });
};

// 🧩 Delete Vehicle Make
export const deleteVehicleMakeApi = async (id: number): Promise<ApiResponse<string>> => {
  return await requestApi({
    url: `/admin/vehicle-makes/${id}`,
    method: 'DELETE',
    successMessage: 'Vehicle make deleted successfully!',
  });
};
