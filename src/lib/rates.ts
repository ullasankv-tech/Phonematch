import {
  CURRENCY_CODES,
  CurrencyCode,
  FALLBACK_RATES,
  FALLBACK_RATES_DATE,
  RateTable,
} from "./currency";

/**
 * Free, key-less daily FX feed. Both URLs serve the same dataset; the second is
 * the upstream mirror, used if the CDN is unreachable. Response shape:
 *   { date: "2026-10-30", usd: { inr: 95.24, eur: 0.89, ... } }
 */
const RATE_SOURCES = [
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
  "https://latest.currency-api.pages.dev/v1/currencies/usd.json",
];

export interface RatesResult {
  rates: RateTable;
  date: string;
  /** false when every source failed and the bundled snapshot was used */
  live: boolean;
}

export async function fetchRates(timeoutMs = 10000): Promise<RatesResult> {
  for (const url of RATE_SOURCES) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
      if (!res.ok) continue;

      const json: any = await res.json();
      const table = json?.usd;
      if (!table || typeof table !== "object") continue;

      const rates: RateTable = { USD: 1 };
      for (const code of CURRENCY_CODES) {
        const value = table[code.toLowerCase()];
        if (typeof value === "number" && value > 0) rates[code] = value;
      }

      // A partial response is worse than the bundled snapshot.
      if (Object.keys(rates).length < CURRENCY_CODES.length) continue;

      return {
        rates,
        date:
          typeof json.date === "string"
            ? json.date
            : new Date().toISOString().slice(0, 10),
        live: true,
      };
    } catch {
      // network error / timeout / bad JSON - fall through to the next source
    } finally {
      clearTimeout(timer);
    }
  }

  return { rates: FALLBACK_RATES, date: FALLBACK_RATES_DATE, live: false };
}

export function formatRateSummary(code: CurrencyCode, rates: RateTable): string {
  const rate = rates[code];
  if (typeof rate !== "number" || rate <= 0) return "";
  const decimals = rate >= 10 ? 2 : 4;
  return `1 USD = ${rate.toFixed(decimals)} ${code}`;
}
