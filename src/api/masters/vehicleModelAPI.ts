'use client';

import { requestApi } from '../index';

export interface VehicleModel {
  id?: number;
  make_id: number;
  name: string;
  make_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}

// 🧩 List all Vehicle Models
export const getVehicleModelsApi = async (): Promise<ApiResponse<VehicleModel[]>> => {
  return await requestApi({
    url: '/admin/vehicle-models',
    method: 'GET',
  });
};

// 🧩 Get Vehicle Model by ID
export const getVehicleModelByIdApi = async (id: number): Promise<ApiResponse<VehicleModel>> => {
  return await requestApi({
    url: `/admin/vehicle-models/${id}`,
    method: 'GET',
  });
};

// 🧩 Create Vehicle Model (JSON body)
export const createVehicleModelApi = async (
  data: { make_id: string | number; name: string }
): Promise<ApiResponse<VehicleModel>> => {
  return await requestApi({
    url: '/admin/vehicle-models',
    method: 'POST',
    data,
    headers: { 'Content-Type': 'application/json' },
    successMessage: 'Vehicle model created successfully!',
  });
};

// 🧩 Update Vehicle Model (JSON body)
export const updateVehicleModelApi = async (
  id: number,
  data: { make_id: string | number; name: string }
): Promise<ApiResponse<VehicleModel>> => {
  return await requestApi({
    url: `/admin/vehicle-models/${id}`,
    method: 'PUT',
    data,
    headers: { 'Content-Type': 'application/json' },
    successMessage: 'Vehicle model updated successfully!',
  });
};

// 🧩 Delete Vehicle Model
export const deleteVehicleModelApi = async (id: number): Promise<ApiResponse<string>> => {
  return await requestApi({
    url: `/admin/vehicle-models/${id}`,
    method: 'DELETE',
    successMessage: 'Vehicle model deleted successfully!',
  });
};
