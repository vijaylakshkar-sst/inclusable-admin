// src/api/dashboard/monthlyBookingChart.ts
import { requestApi } from "../index";

export interface MonthlyBookingChartData {
  labels: string[];
  data: number[];
}

export const getMonthlyBookingChartData = async (): Promise<{ status: boolean; data: MonthlyBookingChartData }> => {
  return await requestApi({
    url: '/admin/dashboard/monthly-revenue',
    method: 'GET',
    successMessage: 'Monthly booking amount fetched!',
  });
};
