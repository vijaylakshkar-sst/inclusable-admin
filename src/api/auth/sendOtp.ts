// src/api/auth/sendOtp.ts
import { requestApi } from '../index';

interface SendOtpPayload {
  email: string;
  mobile?: string;
  type: 'register' | 'forgot';
}

export const sendOtpApi = async (data: SendOtpPayload) => {
  const response = await requestApi({
    url: '/send-otp',
    method: 'POST',
    data,
    successMessage: 'OTP sent successfully!', // Optional: Customize as needed
  });

  return response;
};
