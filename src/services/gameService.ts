import { api } from '@/lib';
import { CreateRoomFormInputs } from '@/types';

export const createRoom = async (data: CreateRoomFormInputs) => {
  const response = await api.post('game', data);
  return response.data;
};
