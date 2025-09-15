'use client';

import { requestApi } from '../index';

// ✅ NDIS Member type
export interface NdisMember {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  profile_image: string | null;
  gender: string | null;
  created_at: string | null;
}

// ✅ Business Member type
export interface BusinessMember {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  profile_image: string | null;
  date_of_birth: string | null;
  gender: string | null;
  business_name: string;
  business_category: string;
  business_email: string;
  business_phone_number: string;
  business_logo: string;
  abn_number: string;
  ndis_registration_number: string;
  website_url: string;
  year_experience: number;
  address: string;
  business_overview: string;
}


// 🧑‍🦽 NDIS Members
export const getNdisMembers = async (): Promise<{ status: boolean; data: NdisMember[] }> => {
 return await requestApi({
    url: '/admin/users/ndis-members',
    method: 'GET',
    successMessage: 'NDIS Members fetched successfully!',
  });
};

// 🏢 Business Members
export const getBusinessMembers = async (): Promise<{ status: boolean; data: BusinessMember[] }> => {
   return await requestApi({
    url: '/admin/users/business-members',
    method: 'GET',
    successMessage: 'Business Members fetched successfully!',
  });
};

export const deleteUser = async (id: number) => {
   return await requestApi({
    url: '/admin/users/' + id,
    method: 'DELETE',
    successMessage: 'Member Deleted successfully!',
  });
};

export const eventByBusiness = async (id: number) => {
   return await requestApi({
    url: '/admin/users/events-by-business/' + id,
    method: 'GET',
    successMessage: 'Events Fetched successfully!',
  });
};

export const userBookings = async (id: number) => {
   return await requestApi({
    url: '/admin/users/user-bookings/' + id,
    method: 'GET',
    successMessage: 'Booking Fetched successfully!',
  });
};

export const deleteEvent = async (id: number) => {
   return await requestApi({
    url: '/admin/users/event/' + id,
    method: 'DELETE',
    successMessage: 'Event Deleted successfully!',
  });
};

