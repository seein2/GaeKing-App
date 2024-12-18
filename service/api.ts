import axios from 'axios';
import config from '@/config/config';
import { tokenStorage } from './tokenStorage';

const api = axios.create({
  baseURL: config.API_URL
});

// 서버에 요청을 보내기 전에 자동으로 실행됨.
api.interceptors.request.use(
  async (config) => {
    const accessToken = await tokenStorage.getAccessToken(); // 사용자의 토큰을 가져와서
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // 요청 헤더에 넣음
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 받은 후
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 서버에서 보낸 에러 메시지가 있다면 그대로 전달
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    const originalRequest = error.config;
    originalRequest._retry = originalRequest._retry || false;

    // 서버의 미들웨어에서 토큰만료(401) 에러를 보내면,
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login') {
      originalRequest._retry = true;

      try {
        // 리프레쉬토큰 확인
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) throw new Error('리프레쉬토큰이 없음');

        // 리프레쉬토큰이 있으면 서버에 엑세스토큰을 요청
        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken } = response.data;
        
        // 엑세스토큰을 받았으면 엑세스토큰을 헤더에 넣고 다시 요청 실행
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