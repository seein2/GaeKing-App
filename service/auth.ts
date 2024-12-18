import api from '@/service/api';
import { tokenStorage } from './tokenStorage';

interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

interface User {
  id: string;
  user_name: string;
}

const auth = {
  join: async (id: string, password: string, user_name: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/join', { id, password, user_name });
      const data: AuthResponse = response.data;

      if (!data.success) {
        throw new Error(data.message);
      }

      if (data.accessToken && data.refreshToken) {
        await tokenStorage.setTokens(data.accessToken, data.refreshToken);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  login: async (id: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', { id, password });
      const data: AuthResponse = response.data;

      if (!data.success) {
        throw new Error(data.message);
      }

      if (data.accessToken && data.refreshToken) {
        await tokenStorage.setTokens(data.accessToken, data.refreshToken);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<AuthResponse> => {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      const response = await api.post('/auth/logout', { refreshToken });
      const data: AuthResponse = response.data;

      if (!data.success) {
        throw new Error(data.message);
      }

      await tokenStorage.removeTokens();
      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default auth;