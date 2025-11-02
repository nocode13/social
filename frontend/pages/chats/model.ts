import { api } from '@/shared/api';
import { ShortChat } from '@/shared/api/types';
import { createEffect, createStore, sample } from 'effector';
import { createGate } from 'effector-react';

export const Gate = createGate();

export const $chats = createStore<ShortChat[]>([]);

const findAllChatsFx = createEffect(() => api.chat.findAll());

sample({
  clock: Gate.open,
  filter: Gate.status,
  target: findAllChatsFx,
});

sample({
  clock: findAllChatsFx.doneData,
  fn: (response) => response.data.data,
  target: $chats,
});
