import { baseInstance } from './baseInstace';
import { LoginBody, LoginAndSignupRes, SignupBody } from './dtos';

export const auth = {
  login: (body: LoginBody) =>
    baseInstance.post<LoginAndSignupRes>('/auth/login', body),
  signup: (body: SignupBody) =>
    baseInstance.post<LoginAndSignupRes>('/auth/register', body),
};
