import axiosInstance from '../../api/axiosInstance';
import type { LoginData, RegisterData } from '../../types';

export const authService = {
  login: async (data: LoginData) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterData) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  }
};
