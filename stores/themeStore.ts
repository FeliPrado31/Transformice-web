import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeState } from "@/types";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
    }),
    {
      name: "theme-storage",
    }
  )
);
