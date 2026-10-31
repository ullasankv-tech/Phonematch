import { Phone } from "../../lib/types";

interface Props {
  phone: Phone;
  confidence: "High" | "Medium" | "Low";
  reason: string;
}

export default function RecommendationCard({
  phone,
  confidence,
  reason,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-gray-500">{phone.brand}</p>
          <h2 className="text-2xl font-bold">{phone.model}</h2>
        </div>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {confidence} confidence
        </span>
      </div>

      <p className="text-gray-700 mb-4">{reason}</p>

      <div className="flex justify-between items-center">
        <span className="text-xl font-semibold">${phone.price_start}</span>
        <span className="text-sm text-gray-500">
          Match score: {phone.finalScore}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {phone.strengths.slice(0, 3).map((s) => (
          <span
            key={s}
            className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
