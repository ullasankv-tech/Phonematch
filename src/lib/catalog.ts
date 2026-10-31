import { Phone } from "./types";

export interface Catalog {
  /** Content-derived, e.g. "12-a1b2c3d4" - changes only when the phone list changes. */
  version: string;
  updated_at: string;
  base_currency: "USD";
  phones: Phone[];
}

export function isCatalog(value: any): value is Catalog {
  if (!value || typeof value !== "object") return false;
  if (typeof value.version !== "string") return false;
  if (!Array.isArray(value.phones) || value.phones.length === 0) return false;

  return value.phones.every((p: any) => {
    if (!p || typeof p !== "object") return false;
    if (typeof p.id !== "string" || typeof p.model !== "string") return false;
    if (typeof p.price_start !== "number" || !Number.isFinite(p.price_start)) return false;
    if (!p.scores || typeof p.scores !== "object") return false;
    return true;
  });
}

export async function fetchCatalog(url: string, timeoutMs = 12000): Promise<Catalog> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Catalogue server returned ${res.status}`);
    }
    const json = await res.json();
    if (!isCatalog(json)) {
      throw new Error("Catalogue response was not in the expected format");
    }
    return {
      version: json.version,
      updated_at:
        typeof json.updated_at === "string"
          ? json.updated_at
          : new Date().toISOString().slice(0, 10),
      base_currency: "USD",
      phones: json.phones,
    };
  } finally {
    clearTimeout(timer);
  }
}
