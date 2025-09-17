import { requestApi } from '../index';

export interface DashboardStats {
  "target": number;
  "todayBookings": number;
  "monthlyBookings": number;
  "percentageAchieved": number;
  "changePercentage": number;
  "todayAmount": number;
  "monthlyAmount": number;
  "lastMonthAmount": number;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}

export const getStats = async (): Promise<ApiResponse<DashboardStats>> => {
  return await requestApi({
    url: '/admin/dashboard/stats',
    method: 'GET',
    successMessage: '', // Optional: leave empty if you don't want toast
  });
};
