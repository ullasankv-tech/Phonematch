"use client";

import { useRouter } from "next/navigation";

interface Props {
  /** Where to go when the page was opened directly and there is no history. */
  fallback?: string;
  label?: string;
}

/**
 * Consistent back control for every page. Uses real history when there is some,
 * so "back" means the page the user came from rather than a fixed route.
 */
export default function BackButton({ fallback = "/", label = "Back" }: Props) {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
    >
      <span aria-hidden="true">←</span> {label}
    </button>
  );
}
