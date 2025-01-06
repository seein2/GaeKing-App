interface User {
  user_id: string;
  user_name: string;
};

interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}