// src/api/auth/changePassword.ts
import { requestApi } from '../index';

interface ChangePasswordPayload {
  password: string;
  resetToken: string;
}

interface ChangePasswordResponse {
  status: boolean;
  message: string;
  [key: string]: any;
}

export const changePasswordApi = async (
  { password, resetToken }: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
  try {
    const response = await requestApi<ChangePasswordResponse>({
      url: '/change-password',
      method: 'POST',
      data: { password },
      headers: {
        resetToken: resetToken || '',
      },
    });

    return response;
  } catch (error: any) {
    return {
      status: false,
      message: error.response?.data?.message || error.message || 'Something went wrong',
    };
  }
};
