const ENV = {
  development: {
    // API_URL: 'http://175.192.217.28:3000'
    API_URL: 'http://172.30.1.55:3000'
  },
  production: {
    API_URL: ''  // 운영 서버 주소
  }
};

// 현재 환경 설정
const getEnvVars = () => {
  return ENV.development;  // 배포시엔 ENV.production
};

export default getEnvVars();