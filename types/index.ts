export interface Player {
  _id: number;
  playerName: string;
  cheeseCount: number;
  firstCount: number;
  shamanLevel: number;
  normalSaves: number;
  hardSaves: number;
  divineSaves: number;
  shamanCheeseCount: number;
  playedTime: number;
  regDate: number;
  lastOn: number;
  titleList: number[];
  currentTitle: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  cheeseCount: number;
  shamanLevel: number;
  saves: number;
}

export interface GameSettings {
  volume: number;
  quality: "low" | "medium" | "high";
  fullscreen: boolean;
}

export interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export interface ServerStats {
  totalPlayers: number;
  onlinePlayers: number;
  totalCheese: number;
  totalSaves: number;
}
