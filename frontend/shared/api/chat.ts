import { AxiosRequestConfig } from 'axios';
import { baseInstance } from './baseInstace';
import { FindAllChatsRes } from './dtos';

export const chat = {
  findAll: (config?: AxiosRequestConfig) =>
    baseInstance.get<FindAllChatsRes>('/chats'),
};
