import { requestApi } from '../index';

export interface DashboardCardsCount {
  "NDIS Member": number;
  "Company": number;
  "Cab Owner": number;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}

export const getCardCounts = async (): Promise<ApiResponse<DashboardCardsCount>> => {
  return await requestApi({
    url: '/admin/dashboard/counts',
    method: 'GET',
    successMessage: '', // Optional: leave empty if you don't want toast
  });
};
