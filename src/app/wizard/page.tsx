"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "../../store/usePreferences";

export default function WizardPage() {
  const router = useRouter();
  const { preferences, setBudget, setPriority, toggleDealBreaker } =
    usePreferences();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else router.push("/results");
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                s <= step ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Budget */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold mb-2">
              What&apos;s your maximum budget?
            </h1>
            <p className="text-gray-600 mb-8">
              We&apos;ll only show phones within this range.
            </p>

            <div className="text-center mb-6">
              <span className="text-4xl font-bold text-blue-600">
                ${preferences.budget_max}
              </span>
            </div>

            <input
              type="range"
              min={600}
              max={2000}
              step={50}
              value={preferences.budget_max}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full mb-8 accent-blue-600"
            />

            <div className="flex justify-between text-sm text-gray-500 mb-8">
              <span>$600</span>
              <span>$2000</span>
            </div>
          </div>
        )}

        {/* Step 2: Priorities */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold mb-2">
              What matters most to you?
            </h1>
            <p className="text-gray-600 mb-6">
              Adjust the importance of each factor.
            </p>

            {Object.entries(preferences.priorities).map(([key, value]) => (
              <div key={key} className="mb-5">
                <div className="flex justify-between mb-1">
                  <span className="capitalize font-medium">{key}</span>
                  <span className="text-blue-600 font-semibold">{value}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={value}
                  onChange={(e) =>
                    setPriority(
                      key as keyof typeof preferences.priorities,
                      Number(e.target.value)
                    )
                  }
                  className="w-full accent-blue-600"
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Deal-breakers */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold mb-2">Any deal-breakers?</h1>
            <p className="text-gray-600 mb-6">
              Select things you want to avoid or require.
            </p>

            <div className="space-y-3">
              {[
                { id: "foldable", label: "No foldables" },
                {
                  id: "short-updates",
                  label: "Must have long software support",
                },
                { id: "no-s-pen", label: "I want an S Pen / stylus" },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={preferences.deal_breakers.includes(item.id)}
                    onChange={() => toggleDealBreaker(item.id)}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-5 py-2.5 rounded-lg text-gray-600 disabled:opacity-40"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {step === 3 ? "See Results" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
