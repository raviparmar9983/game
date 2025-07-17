import { api } from '@/lib';

export const getUserProfile = async () => {
  const response = await api.get('');
  return response.data;
};
