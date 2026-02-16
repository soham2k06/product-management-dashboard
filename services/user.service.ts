import apiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/constants";
import { UsersListResponse } from "@/types";
import { unstable_cache } from "@/lib/unstable_cache";

export const userService = {
  getUsers: async ({
    limit,
    search,
    skip,
    select,
  }: {
    search?: string;
    limit?: number;
    skip?: number;
    select?: string;
  }) =>
    unstable_cache(
      async (): Promise<UsersListResponse> => {
        const baseUrl = search
          ? API_ENDPOINTS.USERS.SEARCH
          : API_ENDPOINTS.USERS.LIST;

        const params = new URLSearchParams({});

        if (limit) params.append("limit", limit.toString());
        if (skip) params.append("skip", skip.toString());
        if (search) params.append("q", search);
        if (select) params.append("select", select); // e.g. "id,title,price"

        const response = await apiClient.get<UsersListResponse>(
          `${baseUrl}?${params.toString()}`,
        );

        return response.data;
      },
      ["users", search || "", String(limit), String(skip), select || ""],
      { revalidate: 60 },
    )(),
};
