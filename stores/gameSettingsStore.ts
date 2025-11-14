import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameSettings } from "@/types";

interface GameSettingsStore extends GameSettings {
  setVolume: (volume: number) => void;
  setQuality: (quality: "low" | "medium" | "high") => void;
  toggleFullscreen: () => void;
}

export const useGameSettingsStore = create<GameSettingsStore>()(
  persist(
    (set) => ({
      volume: 0.7,
      quality: "medium",
      fullscreen: false,
      setVolume: (volume) => set({ volume }),
      setQuality: (quality) => set({ quality }),
      toggleFullscreen: () =>
        set((state) => ({ fullscreen: !state.fullscreen })),
    }),
    {
      name: "game-settings-storage",
    }
  )
);
