import { getUserProfile } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useUserProfileQuery = () =>
  useQuery({
    queryKey: [''],
    queryFn: getUserProfile,
  });
