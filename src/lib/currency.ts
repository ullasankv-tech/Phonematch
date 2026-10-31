export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED" | "JPY";

export interface CurrencyMeta {
  code: CurrencyCode;
  label: string;
  symbol: string;
  locale: string;
}

/** All phone prices in the dataset are stored in USD. */
export const BASE_CURRENCY = "USD" as const;

export const CURRENCIES: CurrencyMeta[] = [
  { code: "INR", label: "Indian Rupee", symbol: "₹", locale: "en-IN" },
  { code: "USD", label: "US Dollar", symbol: "$", locale: "en-US" },
  { code: "EUR", label: "Euro", symbol: "€", locale: "de-DE" },
  { code: "GBP", label: "Pound Sterling", symbol: "£", locale: "en-GB" },
  { code: "AED", label: "UAE Dirham", symbol: "AED", locale: "en-AE" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥", locale: "en-US" },
];

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code);

export const DEFAULT_CURRENCY: CurrencyCode = "INR";

/**
 * Offline fallback rates, expressed as "1 USD = N units of this currency".
 * Snapshot taken 2026-10-30. Live rates replace these at runtime whenever the
 * device has a connection; these only keep the app usable when it does not.
 */
export const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  INR: 95.2478,
  EUR: 0.894013,
  GBP: 0.747079,
  AED: 3.6725,
  JPY: 157.5028,
};

export const FALLBACK_RATES_DATE = "2026-10-30";

export type RateTable = Partial<Record<CurrencyCode, number>>;

export function getCurrencyMeta(code: CurrencyCode): CurrencyMeta {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

/** Rate for `code`, falling back to the bundled snapshot if none is supplied. */
export function rateFor(code: CurrencyCode, rates?: RateTable): number {
  const live = rates?.[code];
  if (typeof live === "number" && live > 0) return live;
  return FALLBACK_RATES[code] ?? 1;
}

export function fromUsd(amountUsd: number, code: CurrencyCode, rates?: RateTable): number {
  return amountUsd * rateFor(code, rates);
}

export function toUsd(amount: number, code: CurrencyCode, rates?: RateTable): number {
  return amount / rateFor(code, rates);
}

/**
 * Format a USD amount in the chosen currency, using that currency's own
 * locale so grouping is right (lakh/crore for INR, standard for the rest).
 */
export function formatMoney(
  amountUsd: number,
  code: CurrencyCode,
  rates?: RateTable
): string {
  const meta = getCurrencyMeta(code);
  const value = fromUsd(amountUsd, code, rates);
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${meta.symbol}${Math.round(value).toLocaleString("en-IN")}`;
  }
}

/** Format an already-converted amount (no FX applied). */
export function formatAmount(
  amount: number,
  code: CurrencyCode
): string {
  const meta = getCurrencyMeta(code);
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${meta.symbol}${Math.round(amount).toLocaleString("en-IN")}`;
  }
}

/**
 * Budget slider bounds, converted to the display currency.
 *
 * The floor is expressed in INR so it reads as a round number in the app's
 * default currency (10,000) and is then converted to the USD the dataset uses.
 */
export const BUDGET_MIN_INR = 10000;
export const BUDGET_MIN_USD = BUDGET_MIN_INR / FALLBACK_RATES.INR;
export const BUDGET_MAX_USD = 2000;
export function budgetBounds(code: CurrencyCode, rates?: RateTable) {
  return {
    min: fromUsd(BUDGET_MIN_USD, code, rates),
    max: fromUsd(BUDGET_MAX_USD, code, rates),
  };
}

/** A "nice" slider step (1, 2 or 5 x a power of ten) for the given span. */
export function niceStep(span: number): number {
  if (!Number.isFinite(span) || span <= 0) return 1;
  const rough = span / 20;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const normalised = rough / magnitude;
  const multiplier = normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 5 ? 5 : 10;
  return multiplier * magnitude;
}

export function snapToStep(value: number, step: number): number {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}
