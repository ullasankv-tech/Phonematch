"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          PhoneMatch
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Tell us what matters most. We&apos;ll find the best smartphone for you
          and show how it compares to the alternatives.
        </p>
        <button
          onClick={() => router.push("/wizard")}
          className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Start Matching
        </button>
        <p className="mt-4 text-sm text-gray-500">Takes less than 60 seconds</p>
      </div>
    </div>
  );
}
