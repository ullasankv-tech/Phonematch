"use client";

import { useEffect } from "react";
import { CATALOG_URL } from "@/lib/config";
import { useCatalog } from "@/store/useCatalog";

export default function CatalogUpdater() {
  const status = useCatalog((s) => s.status);
  const message = useCatalog((s) => s.message);
  const newArrivals = useCatalog((s) => s.newArrivals);
  const updatedAt = useCatalog((s) => s.updatedAt);
  const checkForUpdates = useCatalog((s) => s.checkForUpdates);

  // Only poll a catalogue server that exists; otherwise stay silent and let the
  // user ask for a check, which explains the bundled-catalogue situation.
  useEffect(() => {
    if (CATALOG_URL) void checkForUpdates();
  }, [checkForUpdates]);

  return (
    <div className="mt-12 w-full max-w-xl text-center text-sm text-gray-500">
      {status === "checking" && <p>Checking for new phones…</p>}

      {status === "updated" && (
        <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-blue-800">
          <p className="font-medium">{message}</p>
          {newArrivals.length > 0 && (
            <p className="mt-1 text-blue-700">{newArrivals.join(", ")}</p>
          )}
        </div>
      )}

      {status === "uptodate" && <p>You already have the latest catalogue.</p>}

      {status === "error" && (
        <p className="text-gray-500">{message}</p>
      )}

      {status === "idle" && (
        <p className="text-xs text-gray-400">Catalogue as of {updatedAt}</p>
      )}

      <button
        type="button"
        onClick={() => void checkForUpdates()}
        disabled={status === "checking"}
        className="mt-3 text-blue-600 hover:underline disabled:opacity-50"
      >
        {status === "checking" ? "Checking…" : "Check for phone updates"}
      </button>
    </div>
  );
}
