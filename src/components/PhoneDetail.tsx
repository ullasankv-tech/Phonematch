"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";
import { formatMoney } from "@/lib/currency";
import { weightedScore } from "@/lib/scoring";
import { useCatalog } from "@/store/useCatalog";
import { usePreferences } from "@/store/usePreferences";
import { useShortlist } from "@/store/useShortlist";

const ATTRIBUTES = [
  { key: "camera", label: "Camera" },
  { key: "battery", label: "Battery" },
  { key: "performance", label: "Performance" },
  { key: "display", label: "Display" },
  { key: "software", label: "Software" },
  { key: "build", label: "Build quality" },
  { key: "value", label: "Value" },
] as const;

export default function PhoneDetail({ id }: { id: string }) {
  const phones = useCatalog((s) => s.phones);
  const currency = usePreferences((s) => s.currency);
  const rates = usePreferences((s) => s.rates);
  const preferences = usePreferences((s) => s.preferences);
  const savedIds = useShortlist((s) => s.ids);
  const toggleSaved = useShortlist((s) => s.toggle);

  const phone = phones.find((p) => p.id === id);

  if (!phone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-600">That phone isn&apos;t in your catalogue.</p>
        <BackButton fallback="/brands" label="Back to brands" />
      </div>
    );
  }

  const saved = savedIds.includes(phone.id);
  const match = weightedScore(phone, preferences);
  const priorities = preferences.priorities;

  const share = () => {
    const text =
      `${phone.brand} ${phone.model} - ${formatMoney(phone.price_start, currency, rates)}` +
      `, match ${match}/100 for what I care about.`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <BackButton fallback="/brands" label="Back" />

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">{phone.brand}</p>
              <h1 className="text-3xl font-bold">{phone.model}</h1>
              <p className="text-blue-600 font-medium mt-1">
                {formatMoney(phone.price_start, currency, rates)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">{match}</p>
              <p className="text-xs text-gray-500">match / 100</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {phone.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => toggleSaved(phone.id)}
              className={`px-5 py-2.5 rounded-lg font-medium transition ${
                saved
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {saved ? "Saved to shortlist" : "Save to shortlist"}
            </button>
            <button
              onClick={share}
              className="border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition"
            >
              Share on WhatsApp
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-1">How it scored</h2>
          <p className="text-sm text-gray-500 mb-4">
            Each bar is the attribute score multiplied by the weight you set.
          </p>

          <div className="space-y-3">
            {ATTRIBUTES.map((attr) => {
              const raw = phone.scores[attr.key];
              const weight = priorities[attr.key];
              const contribution = (raw * weight) / 100;
              return (
                <div key={attr.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{attr.label}</span>
                    <span className="text-gray-500">
                      {raw} × {weight}% = {contribution.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${raw}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="font-semibold text-green-700 mb-3">Strengths</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {phone.strengths.map((s) => (
                <li key={s}>· {s}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="font-semibold text-red-700 mb-3">Weaknesses</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {phone.weaknesses.map((w) => (
                <li key={w}>· {w}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/shortlist"
            className="text-sm text-blue-600 hover:underline"
          >
            View my shortlist
          </Link>
        </div>
      </div>
    </div>
  );
}
