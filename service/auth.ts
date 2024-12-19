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
  user_id: string;
  user_name: string;
}

const auth = {
  join: async (user_id: string, password: string, user_name: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/join', { user_id, password, user_name });
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

  login: async (user_id: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', { user_id, password });
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

  // 자동로그인
  initializeAuth: async (): Promise<User | null> => {
    try {
      const token = await tokenStorage.getAccessToken();
      console.log("유저의 엑세스토큰: ", token);

      if (!token) return null;

      const response = await api.get('/auth/info');
      console.log('유저 정보 응답:', response.data);
      return response.data.user;
    } catch (error) {
      await tokenStorage.removeTokens();
      return null;
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