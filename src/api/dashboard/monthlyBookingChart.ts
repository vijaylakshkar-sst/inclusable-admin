import { requestApi } from "../index";

export interface MonthlyBookingChartData {
  labels: string[];
  eventData: number[];
  cabData: number[];
  totalData: number[];
}

export const getMonthlyBookingChartData = async (): Promise<{ status: boolean; data: MonthlyBookingChartData }> => {
  return await requestApi({
    url: '/admin/dashboard/monthly-revenue',
    method: 'GET',
    successMessage: 'Monthly booking revenue fetched successfully!',
  });
};