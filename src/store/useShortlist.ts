"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ShortlistState {
  ids: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

/**
 * Phones the user has saved to look at again. Kept as bare ids so the list
 * survives catalogue updates - a phone whose data changes is still the same
 * phone, and one that disappears simply drops out of the view.
 */
export const useShortlist = create<ShortlistState>()(
  persist(
    (set) => ({
      ids: [],

      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((x) => x !== id)
            : [...state.ids, id],
        })),

      remove: (id) =>
        set((state) => ({ ids: state.ids.filter((x) => x !== id) })),

      clear: () => set({ ids: [] }),
    }),
    {
      name: "phonematch-shortlist",
      // Same reason as the other stores: rehydrated by StoreHydrator after mount
      // so the prerendered HTML matches the first client render.
      skipHydration: true,
    }
  )
);
