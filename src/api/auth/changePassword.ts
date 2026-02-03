// src/api/auth/changePassword.ts
import { requestApi } from "../index";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  resetToken: string;
}

interface ChangePasswordResponse {
  status: boolean;
  message: string;
  [key: string]: any;
}

export const changePasswordApi = async ({
  currentPassword,
  newPassword,
  resetToken,
}: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
  try {
    const response = await requestApi<ChangePasswordResponse>({
      url: "/change-password",
      method: "PUT",
      data: {
        current_password:currentPassword,
        new_password:newPassword,
      },
      headers: {
        resetToken,
      },
    });

    return response;
  } catch (error: any) {
    return {
      status: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong",
    };
  }
};
