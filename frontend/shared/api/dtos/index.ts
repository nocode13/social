import { User } from '../types';

export type GetMeRes = {
  status: string;
  user: User;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type SignupBody = {
  email: string;
  password: string;
  name: string;
};

export type LoginAndSignupRes = {
  status: string;
  user: User;
  authorization: {
    token: string;
    type: string;
  };
};
