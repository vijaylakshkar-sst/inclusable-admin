// src/api/auth/register.ts
import { requestApi } from '../index';

interface RegisterPayload {
  fullname: string;
  email: string;
  mobile: string;
  address: string;
  password: string;
}

export const registerApi = async (data: RegisterPayload) => {
  const response = await requestApi({
    url: '/register',
    method: 'POST',
    data,
    successMessage: 'Registration successful!', // Optional toast
  });

  return response;
};
