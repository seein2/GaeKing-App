import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_STORAGE_KEY = {
  ACCESS_TOKEN: '@ACCESS_TOKEN',
  REFRESH_TOKEN: '@REFRESH_TOKEN',
};

export const tokenStorage = {
  getAccessToken: async () => {    
    return await AsyncStorage.getItem(TOKEN_STORAGE_KEY.ACCESS_TOKEN);
  },

  getRefreshToken: async () => {
    return await AsyncStorage.getItem(TOKEN_STORAGE_KEY.REFRESH_TOKEN);
  },

  setTokens: async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.multiSet([
      [TOKEN_STORAGE_KEY.ACCESS_TOKEN, accessToken],
      [TOKEN_STORAGE_KEY.REFRESH_TOKEN, refreshToken],
    ]);
  },

  removeTokens: async () => {
    await AsyncStorage.multiRemove([
      TOKEN_STORAGE_KEY.ACCESS_TOKEN,
      TOKEN_STORAGE_KEY.REFRESH_TOKEN,
    ]);
  }
};