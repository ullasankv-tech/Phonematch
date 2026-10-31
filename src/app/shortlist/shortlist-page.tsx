"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";
import ComparisonTable from "@/components/comparison/ComparisonTable";
import { formatMoney } from "@/lib/currency";
import { weightedScore } from "@/lib/scoring";
import { useCatalog } from "@/store/useCatalog";
import { usePreferences } from "@/store/usePreferences";
import { useShortlist } from "@/store/useShortlist";

export default function ShortlistPage() {
  const phones = useCatalog((s) => s.phones);
  const currency = usePreferences((s) => s.currency);
  const rates = usePreferences((s) => s.rates);
  const preferences = usePreferences((s) => s.preferences);
  const ids = useShortlist((s) => s.ids);
  const remove = useShortlist((s) => s.remove);
  const clear = useShortlist((s) => s.clear);

  const saved = ids
    .map((id) => phones.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ ...p, finalScore: weightedScore(p, preferences) }))
    .sort((a, b) => (b.finalScore ?? 0) - (a.finalScore ?? 0));

  const share = () => {
    if (saved.length === 0) return;
    const lines = saved.map(
      (p) =>
        `- ${p.brand} ${p.model}: ${formatMoney(p.price_start, currency, rates)}`
    );
    const text = `My PhoneMatch shortlist:\n${lines.join("\n")}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <BackButton fallback="/" label="Home" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">My shortlist</h1>
          {saved.length > 0 && (
            <div className="flex gap-3 text-sm">
              <button onClick={share} className="text-blue-600 hover:underline">
                Share on WhatsApp
              </button>
              <button onClick={clear} className="text-gray-500 hover:underline">
                Clear all
              </button>
            </div>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="bg-white rounded-2xl border p-10 text-center">
            <p className="text-gray-600 mb-4">
              Nothing saved yet. Save a phone from your results or from any
              phone&apos;s page and it will appear here.
            </p>
            <Link
              href="/wizard"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Find my best match
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {saved.map((phone) => (
                <div
                  key={phone.id}
                  className="bg-white rounded-xl border p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500">{phone.brand}</p>
                      <Link
                        href={`/phone/${phone.id}`}
                        className="text-lg font-semibold hover:text-blue-600"
                      >
                        {phone.model}
                      </Link>
                      <p className="text-blue-600 font-medium mt-1">
                        {formatMoney(phone.price_start, currency, rates)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        {phone.finalScore}
                      </p>
                      <p className="text-xs text-gray-500">match</p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-3 text-sm">
                    <Link
                      href={`/phone/${phone.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View details
                    </Link>
                    <button
                      onClick={() => remove(phone.id)}
                      className="text-gray-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {saved.length > 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Side by side</h2>
                <ComparisonTable phones={saved.slice(0, 4)} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
