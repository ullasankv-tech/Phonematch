"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "../../store/usePreferences";
import { getRecommendations } from "../../lib/scoring";
import { generateExplanation } from "../../lib/explanations";
import phonesData from "../../data/phones.json";
import { Phone } from "../../lib/types";

import RecommendationCard from "../../components/Results/RecommendationCard";
import ComparisonTable from "../../components/Comparison/ComparisonTable";
import PriorityRadar from "../../components/Comparison/PriorityRadar";

export default function ResultsPage() {
  const router = useRouter();
  const { preferences } = usePreferences();
  const [top, setTop] = useState<Phone | null>(null);
  const [alternatives, setAlternatives] = useState<Phone[]>([]);
  const [confidence, setConfidence] = useState<"High" | "Medium" | "Low">(
    "Medium"
  );
  const [reason, setReason] = useState("");

  useEffect(() => {
    const result = getRecommendations(phonesData as Phone[], preferences);
    setTop(result.top || null);
    setAlternatives(result.alternatives || []);
    setConfidence(result.confidence);

    if (result.top) {
      setReason(
        generateExplanation(result.top, result.alternatives, preferences)
      );
    }
  }, [preferences]);

  const phonesToCompare = top ? [top, ...alternatives] : [];

  if (!top) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-600 text-center">
          No phones match your criteria. Try adjusting your budget or
          priorities.
        </p>
        <button
          onClick={() => router.push("/wizard")}
          className="text-blue-600 hover:underline"
        >
          ← Adjust Preferences
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Best Match</h1>
          <button
            onClick={() => router.push("/wizard")}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Adjust Preferences
          </button>
        </div>

        {/* Top Recommendation */}
        <RecommendationCard
          phone={top}
          confidence={confidence}
          reason={reason}
        />

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Strong Alternatives</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alternatives.map((phone) => (
                <div
                  key={phone.id}
                  className="bg-white rounded-xl border p-5 shadow-sm"
                >
                  <p className="text-sm text-gray-500">{phone.brand}</p>
                  <h3 className="font-semibold text-lg">{phone.model}</h3>
                  <p className="text-blue-600 font-medium mt-1">
                    ${phone.price_start}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Match score: {phone.finalScore}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Detailed Comparison</h2>
          <div className="space-y-6">
            <ComparisonTable phones={phonesToCompare} />
            <PriorityRadar phones={phonesToCompare.slice(0, 3)} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Save Recommendation
          </button>
          <button className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition">
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
