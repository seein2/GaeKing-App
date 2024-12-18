import axios from 'axios';
import config from '@/config/config';
import { tokenStorage } from './tokenStorage';

const api = axios.create({
  baseURL: config.API_URL
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = await tokenStorage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 서버에서 보낸 에러 메시지가 있으면 그대로 전달
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    const originalRequest = error.config;
    originalRequest._retry = originalRequest._retry || false;

    // 토큰 관련 에러일 때만 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login') {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken } = response.data;
        
        if (accessToken) {
          await tokenStorage.setTokens(accessToken, refreshToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        await tokenStorage.removeTokens();
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

export default api;