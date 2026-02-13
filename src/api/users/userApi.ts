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
  strip_customer_id: string;
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

// ✅ Cab Owner type
export interface CabOwner {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  vehicle_number?: string | null;
  vehicle_make?: string | null;
  vehicle_model_name?: string | null;
  vehicle_make_name?: string | null;
  vehicle_model?: string | null;
  cab_type?: string | null;
  cab_type_name?: string | null;
  is_available?: boolean;
  status?: string;
  created_at?: string;
}


// ✅ Cab Owner Details type
export interface CabOwnerDetails {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  is_verified: boolean;
  vehicle_number: string;
  vehicle_make: string | null;
  vehicle_model: string | null;
  cab_type: string | null;
  manufacturing_year: number | null;
  license_number: string | null;
  status: string;
  is_available: boolean;
  current_location: {
    lat: number | null;
    lng: number | null;
  };
  images: {
    license_photo_front: string | null;
    license_photo_back: string | null;
    rc_copy: string | null;
    insurance_copy: string | null;
    police_check_certificate: string | null;
    wwvp_card: string | null;
  };
}


// 🧑‍🦽 NDIS Members
export const getNdisMembers = async (): Promise<{ status: boolean; data: NdisMember[] }> => {
 return await requestApi({
    url: '/admin/users/ndis-members',
    method: 'GET',
    // successMessage: 'NDIS Members fetched successfully!',
  });
};

// 🏢 Business Members
export const getBusinessMembers = async (): Promise<{ status: boolean; data: BusinessMember[] }> => {
   return await requestApi({
    url: '/admin/users/business-members',
    method: 'GET',
    // successMessage: 'Business Members fetched successfully!',
  });
};

// 🧑‍✈️ Cab Owners
export const getCabOwners = async (): Promise<{ status: boolean; data: CabOwner[] }> => {
  return await requestApi({
    url: '/admin/users/cab-owners',
    method: 'GET',
    // successMessage: 'Cab Owners fetched successfully!',
  });
};

// 🧩 Cab Owner Details (with full image URLs)
export const getCabOwnerDetails = async (
  id: number
): Promise<{ status: boolean; data: CabOwnerDetails }> => {
  return await requestApi({
    url: `/admin/users/cab-owner/${id}`,
    method: 'GET',
    // successMessage: 'Cab Owner details fetched successfully!',
  });
};

// 🗑️ Delete Cab Owner
export const deleteCabOwner = async (id: number) => {
  return await requestApi({
    url: `/admin/users/cab-owner/${id}`,
    method: 'DELETE',
    successMessage: 'Cab Owner deleted successfully!',
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
    // successMessage: 'Events Fetched successfully!',
  });
};

export const userBookings = async (id: number) => {
   return await requestApi({
    url: '/admin/users/user-bookings/' + id,
    method: 'GET',
    // successMessage: 'Booking Fetched successfully!',
  });
};

export const deleteEvent = async (id: number) => {
   return await requestApi({
    url: '/admin/users/event/' + id,
    method: 'DELETE',
    successMessage: 'Event Deleted successfully!',
  });
};
