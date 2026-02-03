export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  updatePassword: (payload: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
}
