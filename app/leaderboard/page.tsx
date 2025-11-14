"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLeaderboard } from "@/hooks/useStats";
import { Trophy, Medal, Award } from "lucide-react";

export default function LeaderboardPage() {
  const { data, isLoading, error } = useLeaderboard(20);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load leaderboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-orange-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5 p-4 md:p-8">
      <div className="container mx-auto max-w-5xl">
        <Card className="border-2">
          <CardHeader className="space-y-3">
            <CardTitle className="text-4xl flex items-center gap-3">
              <Trophy className="h-10 w-10 text-primary" />
              Clasificaciones
            </CardTitle>
            <CardDescription className="text-base">
              Los mejores jugadores del servidor ordenados por quesos obtenidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-5 rounded-lg transition-all ${
                    entry.rank <= 3
                      ? "bg-primary/10 border-2 border-primary/30 shadow-md"
                      : "bg-card border hover:border-primary/30 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(entry.rank) || (
                        <span className="font-bold text-muted-foreground">
                          #{entry.rank}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        {entry.playerName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Nivel Chamán: {entry.shamanLevel}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-2xl">🧀</span>
                      <p className="text-2xl font-bold text-foreground">
                        {entry.cheeseCount.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {entry.saves} ratones salvados
                    </p>
                  </div>
                </div>
              ))}

              {(!data || data.length === 0) && (
                <div className="text-center py-16">
                  <Trophy className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    ¡No hay jugadores aún! ¡Sé el primero en jugar!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
