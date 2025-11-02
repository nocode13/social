import { ShortChat, User } from '../types';
import { ApiResponse, ApiResponseWithPagination } from './common';

export type GetMeRes = ApiResponse<User>;
export type LoginBody = {
  email: string;
  password: string;
};

export type SignupBody = {
  email: string;
  username: string;
  password: string;
  name: string;
};

export type LoginAndSignupRes = ApiResponse<{
  user: User;
  authorization: {
    token: string;
    type: string;
  };
}>;

export type FindAllChatsRes = ApiResponseWithPagination<ShortChat[]>;
