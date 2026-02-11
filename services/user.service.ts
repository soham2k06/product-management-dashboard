import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/constants';
import { User, UsersListResponse } from '@/types';

export const userService = {
  getUsers: async (limit: number = 10, skip: number = 0): Promise<UsersListResponse> => {
    const response = await apiClient.get<UsersListResponse>(
      `${API_ENDPOINTS.USERS.LIST}?limit=${limit}&skip=${skip}`
    );
    return response.data;
  },

  searchUsers: async (query: string): Promise<UsersListResponse> => {
    const response = await apiClient.get<UsersListResponse>(
      `${API_ENDPOINTS.USERS.SEARCH}?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  getUser: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(
      `${API_ENDPOINTS.USERS.DETAIL}/${id}`
    );
    return response.data;
  },
};
