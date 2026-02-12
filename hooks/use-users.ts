"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/config/constants";
import { userService } from "@/services/user.service";

export const useUsers = (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  return useQuery({
    queryKey: QUERY_KEYS.USERS.LIST(page, limit),
    queryFn: () => userService.getUsers("", limit, skip),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
