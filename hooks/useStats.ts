"use client";

import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/services/api";

export function useLeaderboard(limit = 10) {
  return useQuery({
    queryKey: ["leaderboard", limit],
    queryFn: () => statsService.getLeaderboard(limit),
    staleTime: 1000 * 60 * 5,
  });
}

export function useServerStats() {
  return useQuery({
    queryKey: ["serverStats"],
    queryFn: () => statsService.getServerStats(),
    staleTime: 1000 * 60 * 2,
  });
}
