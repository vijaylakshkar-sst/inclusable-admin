// src/api/dashboard/recentUsers.ts
import { requestApi } from "../index";

export interface RecentUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
  phone_number: string;
  created_at: string;
}

export const getRecentUsers = async (): Promise<{ status: boolean; data: RecentUser[] }> => {
  return await requestApi({
    url: '/admin/dashboard/recent-users',
    method: 'GET',
  });
};
