import { createEffect, sample } from 'effector';

import { api } from '@/shared/api';
import userModel from '@/entities/user';

export const loginFx = createEffect(api.auth.login);
export const $pending = loginFx.pending;

sample({
  clock: loginFx.doneData,
  target: userModel.authPassed,
});

loginFx.fail.watch(console.log);
