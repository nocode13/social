import { createEffect, sample } from 'effector';

import { api } from '@/shared/api';
import userModel from '@/entities/user';

export const signupFx = createEffect(api.auth.signup);
export const $pending = signupFx.pending;

sample({
  clock: signupFx.doneData,
  target: userModel.authPassed,
});

signupFx.fail.watch(console.log);
