import { api } from '@/shared/api';
import { LoginAndSignupRes } from '@/shared/api/dtos';
import { User } from '@/shared/api/types';
import { authStorageService } from '@/shared/lib/auth-storage';
import { AxiosResponse } from 'axios';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { createGate } from 'effector-react';

type Session = 'initial' | 'pending' | 'authorized' | 'unauthorized';

export const authPassed = createEvent<AxiosResponse<LoginAndSignupRes>>();
export const authorized = createEvent();
export const loggedOut = createEvent();

export const Gate = createGate();

export const $user = createStore<User | null>(null).reset(loggedOut);

const fetchSessionFx = createEffect(() => api.user.getMe());

export const $sessionStatus = createStore<Session>('initial')
  .on(fetchSessionFx, () => 'pending')
  .on([fetchSessionFx.done, authPassed], () => 'authorized')
  .on([fetchSessionFx.fail, loggedOut], () => 'unauthorized');

const setTokenToStorageFx = createEffect(authStorageService.setToken);
const removeTokenFromStorageFx = createEffect(authStorageService.removeToken);

sample({
  clock: Gate.open,
  source: $sessionStatus,
  filter: (sessionStatus) => sessionStatus === 'initial',
  target: fetchSessionFx,
});

sample({
  clock: [fetchSessionFx.doneData, authPassed],
  fn: (response) =>
    'user' in response.data.data ? response.data.data.user : response.data.data,
  target: $user,
});

sample({
  clock: authPassed,
  fn: (response) => response.data.data.authorization.token,
  target: setTokenToStorageFx,
});

sample({
  clock: loggedOut,
  target: removeTokenFromStorageFx,
});

sample({
  clock: $sessionStatus,
  filter: (status) => status === 'authorized',
  target: authorized,
});
