import { create } from "zustand";

export const useImageModalStore = create((set) => ({
  image: null,
  open: (image) => set({ image }),
  close: () => set({ image: null }),
}));
