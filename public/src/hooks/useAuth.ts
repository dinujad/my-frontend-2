"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export interface User {
  id: number;
  name: string;
  email: string;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => apiClient<User>("/api/user"),
    retry: false,
  });

  return { user: user ?? null, isLoading };
}
