"use client";

import { CURRENCIES, CurrencyCode } from "@/lib/currency";
import { formatRateSummary } from "@/lib/rates";
import { usePreferences } from "@/store/usePreferences";

interface Props {
  compact?: boolean;
}

export default function CurrencyPicker({ compact = false }: Props) {
  const currency = usePreferences((s) => s.currency);
  const rates = usePreferences((s) => s.rates);
  const ratesDate = usePreferences((s) => s.ratesDate);
  const ratesLive = usePreferences((s) => s.ratesLive);
  const ratesLoading = usePreferences((s) => s.ratesLoading);
  const setCurrency = usePreferences((s) => s.setCurrency);
  const refreshRates = usePreferences((s) => s.refreshRates);

  return (
    <div className={compact ? "flex items-center gap-1.5" : "flex flex-col gap-2"}>
      <select
        aria-label="Display currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="border border-gray-300 rounded-lg bg-white px-2 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {compact ? `${c.symbol} ${c.code}` : `${c.code} – ${c.label}`}
          </option>
        ))}
      </select>

      {!compact && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{formatRateSummary(currency, rates) || "Using bundled rates"}</span>
          <button
            type="button"
            onClick={() => void refreshRates(true)}
            disabled={ratesLoading}
            className="text-blue-600 hover:underline disabled:opacity-50"
          >
            {ratesLoading ? "Refreshing…" : "Refresh rates"}
          </button>
          <span className="text-gray-400">
            {ratesLive ? `live · ${ratesDate}` : `offline snapshot · ${ratesDate}`}
          </span>
        </div>
      )}
    </div>
  );
}
