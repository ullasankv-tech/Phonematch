"use client";

import { Phone } from "../../lib/types";
import { formatMoney } from "../../lib/currency";
import { usePreferences } from "../../store/usePreferences";

interface Props {
  phones: Phone[];
}

const attributes = [
  { key: "camera", label: "Camera" },
  { key: "battery", label: "Battery" },
  { key: "performance", label: "Performance" },
  { key: "display", label: "Display" },
  { key: "software", label: "Software" },
  { key: "build", label: "Build Quality" },
  { key: "value", label: "Value" },
] as const;

export default function ComparisonTable({ phones }: Props) {
  const currency = usePreferences((s) => s.currency);
  const rates = usePreferences((s) => s.rates);

  if (phones.length === 0) return null;

  const bestScores: Record<string, number> = {};
  attributes.forEach((attr) => {
    bestScores[attr.key] = Math.max(...phones.map((p) => p.scores[attr.key]));
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Feature
            </th>
            {phones.map((phone) => (
              <th key={phone.id} className="px-4 py-3 text-center font-semibold">
                <div className="text-xs text-gray-500">{phone.brand}</div>
                <div>{phone.model}</div>
                <div className="text-xs font-normal text-gray-500 mt-1">
                  {formatMoney(phone.price_start, currency, rates)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {attributes.map((attr) => (
            <tr key={attr.key}>
              <td className="px-4 py-3 font-medium text-gray-700">
                {attr.label}
              </td>
              {phones.map((phone) => {
                const score = phone.scores[attr.key];
                const isBest = score === bestScores[attr.key];
                return (
                  <td
                    key={phone.id}
                    className={`px-4 py-3 text-center font-medium ${
                      isBest
                        ? "bg-green-50 text-green-700"
                        : score >= bestScores[attr.key] - 5
                        ? "bg-yellow-50 text-yellow-700"
                        : "text-gray-600"
                    }`}
                  >
                    {score}
                  </td>
                );
              })}
            </tr>
          ))}

          <tr className="bg-blue-50 font-semibold">
            <td className="px-4 py-3">Match Score</td>
            {phones.map((phone) => (
              <td
                key={phone.id}
                className="px-4 py-3 text-center text-blue-800"
              >
                {phone.finalScore ?? "—"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
