// src/api/auth/verifyOtp.ts
import { requestApi } from '../index';

interface VerifyForgetOtpPayload {
  email: string;
  otp: string;
}

export const verifyForgetOtpApi = async (data: VerifyForgetOtpPayload) => {
  const response = await requestApi({
    url: '/auth/verify-forgot-otp',
    method: 'POST',
    data,
    successMessage: 'OTP verified successfully!', // Optional
  });

  return response;
};
