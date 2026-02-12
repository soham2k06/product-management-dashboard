import apiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/constants";
import { UsersListResponse } from "@/types";
import { unstable_cache } from "@/lib/unstable_cache";

export const userService = {
  getUsers: unstable_cache(
    async (
      search: string = "",
      limit: number = 10,
      skip: number = 0,
    ): Promise<UsersListResponse> => {
      const response = await apiClient.get<UsersListResponse>(
        `${search ? API_ENDPOINTS.USERS.SEARCH : API_ENDPOINTS.USERS.LIST}?limit=${limit}&skip=${skip}&q=${encodeURIComponent(search)}`,
      );
      return response.data;
    },
    ["users"],
    { revalidate: 60 * 60 }, // Cache for 1 hour
  ),
};
