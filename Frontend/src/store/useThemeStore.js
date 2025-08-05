import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("connectify-theme") || "synthwave",
  setTheme: (theme) => {
    localStorage.setItem("connectify-theme", theme);
    set({ theme });
  },
}));