"use client";

import { useEffect } from "react";
import { usePreferences } from "@/store/usePreferences";
import { useCatalog } from "@/store/useCatalog";

/**
 * Both persisted stores use skipHydration so the prerendered HTML (defaults)
 * matches the first client render. This component rehydrates them from
 * localStorage after mount, then kicks off a non-blocking FX refresh.
 */
export default function StoreHydrator() {
  useEffect(() => {
    void usePreferences.persist.rehydrate();
    void useCatalog.persist.rehydrate();
    void usePreferences.getState().refreshRates();
  }, []);

  return null;
}
