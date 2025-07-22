import { createRoom } from '@/services';
import { useMutation } from '@tanstack/react-query';

export const useCreateRoom = () => {
  return useMutation({ mutationFn: createRoom });
};
