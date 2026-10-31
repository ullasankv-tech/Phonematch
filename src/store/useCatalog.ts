"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import bundledCatalog from "../data/catalog.json";
import { Catalog, fetchCatalog } from "../lib/catalog";
import { CATALOG_URL } from "../lib/config";
import { Phone } from "../lib/types";

const BUNDLED = bundledCatalog as unknown as Catalog;

export type UpdateStatus = "idle" | "checking" | "uptodate" | "updated" | "error";

interface CatalogState {
  phones: Phone[];
  version: string;
  updatedAt: string;

  status: UpdateStatus;
  message: string | null;
  newArrivals: string[];

  checkForUpdates: () => Promise<void>;
  resetToBundled: () => void;
}

export const useCatalog = create<CatalogState>()(
  persist(
    (set, get) => ({
      phones: BUNDLED.phones,
      version: BUNDLED.version,
      updatedAt: BUNDLED.updated_at,

      status: "idle",
      message: null,
      newArrivals: [],

      checkForUpdates: async () => {
        if (!CATALOG_URL) {
          set({
            status: "error",
            message:
              "This build has no catalogue server configured, so it is using the phones bundled inside the app.",
            newArrivals: [],
          });
          return;
        }

        set({ status: "checking", message: null, newArrivals: [] });

        try {
          const remote = await fetchCatalog(CATALOG_URL);

          if (remote.version === get().version) {
            set({
              status: "uptodate",
              message: "You already have the latest catalogue.",
            });
            return;
          }

          const known = new Set(get().phones.map((p) => p.id));
          const added = remote.phones
            .filter((p) => !known.has(p.id))
            .map((p) => `${p.brand} ${p.model}`);

          set({
            phones: remote.phones,
            version: remote.version,
            updatedAt: remote.updated_at,
            status: "updated",
            newArrivals: added,
            message:
              added.length > 0
                ? `Added ${added.length} new phone${added.length === 1 ? "" : "s"}.`
                : "Catalogue refreshed.",
          });
        } catch {
          set({
            status: "error",
            message:
              "Couldn't reach the catalogue server. You're still seeing the phones bundled with the app.",
            newArrivals: [],
          });
        }
      },

      resetToBundled: () =>
        set({
          phones: BUNDLED.phones,
          version: BUNDLED.version,
          updatedAt: BUNDLED.updated_at,
          status: "idle",
          message: null,
          newArrivals: [],
        }),
    }),
    {
      name: "phonematch-catalog",
      skipHydration: true,
      partialize: (state) => ({
        phones: state.phones,
        version: state.version,
        updatedAt: state.updatedAt,
      }),
    }
  )
);
