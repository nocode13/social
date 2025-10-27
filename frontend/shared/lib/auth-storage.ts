import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ACCESS_TOKEN } from '../config/constants';

class AuthStorage {
  public getToken() {
    if (Platform.OS === 'web') {
      return window.localStorage.getItem(ACCESS_TOKEN);
    }

    return SecureStore.getItem(ACCESS_TOKEN);
  }

  public setToken(token: string) {
    if (Platform.OS === 'web') {
      return window.localStorage.setItem(ACCESS_TOKEN, token);
    }

    return SecureStore.setItem(ACCESS_TOKEN, token);
  }
}

export const authStorageService = new AuthStorage();
