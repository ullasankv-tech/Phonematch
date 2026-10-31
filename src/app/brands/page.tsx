"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/currency";
import { Phone } from "@/lib/types";
import { useCatalog } from "@/store/useCatalog";
import { usePreferences } from "@/store/usePreferences";

export default function BrandsPage() {
  const router = useRouter();
  const phones = useCatalog((s) => s.phones);
  const currency = usePreferences((s) => s.currency);
  const rates = usePreferences((s) => s.rates);

  const brands = useMemo(() => {
    const grouped: Record<string, Phone[]> = {};
    for (const phone of phones) {
      if (!grouped[phone.brand]) grouped[phone.brand] = [];
      grouped[phone.brand].push(phone);
    }
    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .map((brand) => {
        const list = grouped[brand].slice().sort(
          (a: Phone, b: Phone) => a.price_start - b.price_start
        );
        return {
          brand,
          phones: list,
          cheapest: Math.min(...list.map((phone: Phone) => phone.price_start)),
        };
      });
  }, [phones]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">All Brands</h1>
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Home
          </button>
        </div>

        <p className="text-gray-600 mb-8">
          {phones.length} phones across {brands.length} brands. Prices shown in{" "}
          {currency}.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brands.map(({ brand, phones: list, cheapest }) => (
            <div
              key={brand}
              className="bg-white rounded-xl border p-5 shadow-sm"
            >
              <div className="flex items-baseline justify-between mb-1">
                <h2 className="text-lg font-semibold">{brand}</h2>
                <span className="text-xs text-gray-500">
                  {list.length} {list.length === 1 ? "phone" : "phones"}
                </span>
              </div>
              <p className="text-sm text-blue-600 font-medium mb-3">
                From {formatMoney(cheapest, currency, rates)}
              </p>

              <ul className="space-y-2">
                {list.map((phone) => (
                  <li
                    key={phone.id}
                    className="flex items-baseline justify-between gap-3 text-sm border-t pt-2 first:border-t-0 first:pt-0"
                  >
                    <span className="text-gray-800">{phone.model}</span>
                    <span className="text-gray-500 whitespace-nowrap">
                      {formatMoney(phone.price_start, currency, rates)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => router.push("/wizard")}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Find my best match
          </button>
        </div>
      </div>
    </div>
  );
}
