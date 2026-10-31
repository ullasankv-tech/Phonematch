import { create } from "zustand";
import { UserPreferences } from "../lib/types";

interface PreferencesState {
  preferences: UserPreferences;
  setBudget: (budget: number) => void;
  setPriority: (key: keyof UserPreferences["priorities"], value: number) => void;
  toggleDealBreaker: (item: string) => void;
  setPreferredBrands: (brands: string[]) => void;
  reset: () => void;
}

const defaultPriorities = {
  camera: 20,
  battery: 20,
  performance: 15,
  display: 10,
  software: 15,
  build: 10,
  value: 10,
};

export const usePreferences = create<PreferencesState>((set) => ({
  preferences: {
    budget_max: 1100,
    priorities: defaultPriorities,
    deal_breakers: [],
    preferred_brands: [],
  },

  setBudget: (budget) =>
    set((state) => ({
      preferences: { ...state.preferences, budget_max: budget },
    })),

  setPriority: (key, value) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        priorities: {
          ...state.preferences.priorities,
          [key]: value,
        },
      },
    })),

  toggleDealBreaker: (item) =>
    set((state) => {
      const current = state.preferences.deal_breakers;
      const updated = current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item];
      return {
        preferences: { ...state.preferences, deal_breakers: updated },
      };
    }),

  setPreferredBrands: (brands) =>
    set((state) => ({
      preferences: { ...state.preferences, preferred_brands: brands },
    })),

  reset: () =>
    set({
      preferences: {
        budget_max: 1100,
        priorities: defaultPriorities,
        deal_breakers: [],
        preferred_brands: [],
      },
    }),
}));
