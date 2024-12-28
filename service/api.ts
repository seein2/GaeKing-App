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
    // error.config가 undefined인 경우 처리
    if (!error.config) {
      console.log('⚠️ error.config is undefined');
      return Promise.reject(error);
    }

    // 기존 요청 정보가 없는 경우 새로 생성
    const originalRequest = error.config;
    if (originalRequest._retry === undefined) {
      originalRequest._retry = false;
    }

    // 이후 리프레시 토큰 갱신 로직
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
          await tokenStorage.setTokens(accessToken, refreshToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          throw new Error('새 액세스 토큰 발급 실패');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        await tokenStorage.removeTokens();
        throw refreshError;
      }
    }

    // 그 외의 경우는 원래 에러 반환
    return Promise.reject(
      error.response?.data?.message 
        ? new Error(error.response.data.message) 
        : error
    );
  }
);

export default api;