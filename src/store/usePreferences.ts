"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserPreferences } from "../lib/types";
import {
  CurrencyCode,
  DEFAULT_CURRENCY,
  FALLBACK_RATES,
  FALLBACK_RATES_DATE,
  RateTable,
} from "../lib/currency";
import { fetchRates } from "../lib/rates";

/** Re-fetch live FX at most this often unless the user forces it. */
const RATES_MAX_AGE_MS = 12 * 60 * 60 * 1000;

interface PreferencesState {
  preferences: UserPreferences;
  currency: CurrencyCode;
  rates: RateTable;
  ratesDate: string;
  ratesLive: boolean;
  ratesLoading: boolean;

  setBudget: (budgetUsd: number) => void;
  setPriority: (key: keyof UserPreferences["priorities"], value: number) => void;
  toggleDealBreaker: (item: string) => void;
  setPreferredBrands: (brands: string[]) => void;
  setCurrency: (currency: CurrencyCode) => void;
  refreshRates: (force?: boolean) => Promise<void>;
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

const defaultPreferences: UserPreferences = {
  budget_max: 1100,
  priorities: defaultPriorities,
  deal_breakers: [],
  preferred_brands: [],
};

export const usePreferences = create<PreferencesState>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      currency: DEFAULT_CURRENCY,
      rates: FALLBACK_RATES,
      ratesDate: FALLBACK_RATES_DATE,
      ratesLive: false,
      ratesLoading: false,

      setBudget: (budgetUsd) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            budget_max: Math.round(budgetUsd * 100) / 100,
          },
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

      setCurrency: (currency) => set({ currency }),

      refreshRates: async (force = false) => {
        const { ratesDate, ratesLive, ratesLoading } = get();
        if (ratesLoading) return;

        if (!force && ratesLive) {
          const fetchedAt = new Date(`${ratesDate}T00:00:00Z`).getTime();
          if (
            Number.isFinite(fetchedAt) &&
            Date.now() - fetchedAt < RATES_MAX_AGE_MS
          ) {
            return;
          }
        }

        set({ ratesLoading: true });
        const result = await fetchRates();
        set({
          rates: result.rates,
          ratesDate: result.date,
          ratesLive: result.live,
          ratesLoading: false,
        });
      },

      reset: () =>
        set({
          preferences: defaultPreferences,
          currency: DEFAULT_CURRENCY,
        }),
    }),
    {
      name: "phonematch-preferences",
      // Prevents a hydration mismatch between the prerendered HTML (defaults)
      // and localStorage. StoreHydrator calls rehydrate() after mount.
      skipHydration: true,
      partialize: (state) => ({
        preferences: state.preferences,
        currency: state.currency,
        rates: state.rates,
        ratesDate: state.ratesDate,
        ratesLive: state.ratesLive,
      }),
    }
  )
);
