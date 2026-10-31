"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Phone } from "../../lib/types";

interface Props {
  phones: Phone[];
}

const attributes = [
  "camera",
  "battery",
  "performance",
  "display",
  "software",
  "build",
  "value",
] as const;

export default function PriorityRadar({ phones }: Props) {
  if (phones.length === 0) return null;

  const data = attributes.map((attr) => {
    const entry: any = {
      attribute: attr.charAt(0).toUpperCase() + attr.slice(1),
    };
    phones.forEach((phone) => {
      entry[phone.model] = phone.scores[attr];
    });
    return entry;
  });

  const colors = ["#2563eb", "#16a34a", "#ea580c", "#9333ea"];

  return (
    <div className="w-full h-80 bg-white rounded-xl border p-4">
      <h3 className="text-lg font-semibold mb-2">Priority Match Overview</h3>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
          {phones.map((phone, index) => (
            <Radar
              key={phone.id}
              name={phone.model}
              dataKey={phone.model}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
