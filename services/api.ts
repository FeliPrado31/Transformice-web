import type { LeaderboardEntry, ServerStats } from "@/types";

export const statsService = {
  async getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    const response = await fetch(`/api/leaderboard?limit=${limit}`);
    const data = await response.json();
    return data.data || [];
  },

  async getServerStats(): Promise<ServerStats> {
    const response = await fetch("/api/stats");
    const data = await response.json();
    return data.data;
  },
};
