import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '@/config/config';

// 서버의 응답타입
interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}
// 유저 응답타입
interface User {
  id: string;
  user_name: string;
}

// 토큰저장
const TOKEN_STORAGE_KEY = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
};

const auth = {
  // 회원가입
  join: async (id: string, password: string, user_name: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${config.API_URL}/auth/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, password, user_name }),
      });

      const data: AuthResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // 응답데이터의 엑세스토큰과 리프레쉬토큰이 모두 존재하면 asyncstorage에 저장.
      if (data.accessToken && data.refreshToken) {
        await AsyncStorage.multiSet([
          [TOKEN_STORAGE_KEY.ACCESS_TOKEN, data.accessToken],
          [TOKEN_STORAGE_KEY.REFRESH_TOKEN, data.refreshToken],
        ]);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // 로그인
  login: async (id: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${config.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, password }),
      });

      const data: AuthResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      if (data.accessToken && data.refreshToken) {
        await AsyncStorage.multiSet([
          [TOKEN_STORAGE_KEY.ACCESS_TOKEN, data.accessToken],
          [TOKEN_STORAGE_KEY.REFRESH_TOKEN, data.refreshToken],
        ]);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // 로그아웃
  logout: async (): Promise<AuthResponse> => {
    try {
      const refreshToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY.REFRESH_TOKEN);

      const response = await fetch(`${config.API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshToken }),
      });

      const data: AuthResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // 토큰 삭제
      await AsyncStorage.multiRemove([
        TOKEN_STORAGE_KEY.ACCESS_TOKEN,
        TOKEN_STORAGE_KEY.REFRESH_TOKEN,
      ]);

      return data;
    } catch (error) {
      throw error;
    }
  },

  // 토큰 관리 함수
  getAccessToken: async () => {
    return await AsyncStorage.getItem(TOKEN_STORAGE_KEY.ACCESS_TOKEN);
  },

  getRefreshToken: async () => {
    return await AsyncStorage.getItem(TOKEN_STORAGE_KEY.REFRESH_TOKEN);
  },

  refreshAccessToken: async (): Promise<string | null> => {
    try {
      const refreshToken = await auth.getRefreshToken();
      if (!refreshToken) {
        throw new Error('리프레쉬토큰이 없음.');
      }

      const response = await fetch(`${config.API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data: AuthResponse = await response.json();

      if (!data.success || !data.accessToken) {
        throw new Error(data.message);
      }

      await AsyncStorage.setItem(TOKEN_STORAGE_KEY.ACCESS_TOKEN, data.accessToken);
      return data.accessToken;
    } catch (error) {
      throw error;
    }
  },
};

export default auth;