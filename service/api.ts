import axios from 'axios';
import config from '@/config/config';
import { tokenStorage } from './tokenStorage';

const api = axios.create({
  baseURL: config.API_URL
});

// 서버에 요청을 보내기 전에 자동으로 실행됨.
// 요청 인터셉터
api.interceptors.request.use(
  async (config) => {
    const accessToken = await tokenStorage.getAccessToken();
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {

    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    const originalRequest = error.config;
    originalRequest._retry = originalRequest._retry || false;

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login') {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('리프레쉬토큰이 없음');
        }

        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken } = response.data;

        if (accessToken) {
          console.log('새 액세스 토큰 발급 성공');
          await tokenStorage.setTokens(accessToken, refreshToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          console.log('새 액세스 토큰 발급 실패');
          throw new Error('새 액세스 토큰 발급 실패');
        }
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
        await tokenStorage.removeTokens();
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

export default api;