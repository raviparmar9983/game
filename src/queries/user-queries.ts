import { getUserProfile } from '@/services/user-service';
import { useQuery } from '@tanstack/react-query';

export const useUserProfileQuery = () =>
    useQuery({
        queryKey: [''],
        queryFn: getUserProfile,
    });
