import { AxiosRequestConfig } from 'axios';
import { baseInstance } from './baseInstace';
import { GetMeRes } from './dtos';

export const user = {
  getMe: (config?: AxiosRequestConfig) =>
    baseInstance.get<GetMeRes>('/users/me', config),
};
