// src/api/dashboard/monthlyRoleChart.ts
import { requestApi } from "../index";

export interface MonthlyRoleChartData {
  labels: string[];
  ndis: number[];
  business: number[];
}

export const getMonthlyRoleChartData = async (): Promise<{ status: boolean; data: MonthlyRoleChartData }> => {
  return await requestApi({
    url: '/admin/dashboard/monthly-role-counts',
    method: 'GET',
    successMessage: 'Monthly chart data fetched!',
  });
};
