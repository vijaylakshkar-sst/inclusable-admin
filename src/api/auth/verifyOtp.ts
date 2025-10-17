// src/api/auth/verifyOtp.ts
import { requestApi } from '../index';

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export const verifyOtpApi = async (data: VerifyOtpPayload) => {
  const response = await requestApi({
    url: '/auth/verify-otp',
    method: 'POST',
    data,
    successMessage: 'OTP verified successfully!', // Optional toast
  });

  return response;
};
