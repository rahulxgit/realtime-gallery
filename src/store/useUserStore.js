import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "../utils/uuid";

export const useUserStore = create(
  persist(
    (set) => ({
      user: {
        id: generateId(),
        name: `User${Math.floor(Math.random() * 10000)}`,
        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${generateId}`,
      },
      setUserName: (name) =>
        set((state) => ({
          user: { ...state.user, name },
        })),
      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),
    }),
    {
      name: "user-storage",
    }
  )
);
