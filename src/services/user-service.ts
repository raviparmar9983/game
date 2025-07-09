import api from "@/lib/axiosInstance";

export const getUserProfile = async () => {
    const response = await api.get('');
    return response.data;
};
