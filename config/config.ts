const ENV = {
    development: {
    //   API_URL: 'http://172.30.1.2:3000'  // 집
      API_URL: 'http://10.100.1.12:3000' // 학원
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