import { Phone, UserPreferences } from "./types";

export function getRecommendations(phones: Phone[], prefs: UserPreferences) {
  // 1. Filter by budget and deal-breakers
  let candidates = phones.filter((phone) => {
    if (phone.price_start > prefs.budget_max) return false;
    if (
      prefs.deal_breakers.includes("foldable") &&
      phone.tags.includes("foldable")
    ) {
      return false;
    }
    if (
      prefs.deal_breakers.includes("short-updates") &&
      phone.scores.software < 90
    ) {
      return false;
    }
    if (
      prefs.deal_breakers.includes("no-s-pen") &&
      !phone.tags.includes("s-pen")
    ) {
      return false;
    }
    return true;
  });

  // 2. Calculate weighted score
  candidates = candidates.map((phone) => {
    const p = prefs.priorities;
    const s = phone.scores;

    const score =
      (s.camera * p.camera +
        s.battery * p.battery +
        s.performance * p.performance +
        s.display * p.display +
        s.software * p.software +
        s.build * p.build +
        s.value * p.value) /
      100;

    return { ...phone, finalScore: Math.round(score * 10) / 10 };
  });

  // 3. Sort
  candidates.sort((a, b) => (b.finalScore ?? 0) - (a.finalScore ?? 0));

  const top = candidates[0] || null;
  const alternatives = candidates.slice(1, 4);

  // 4. Simple confidence
  let confidence: "High" | "Medium" | "Low" = "Medium";
  if (candidates.length > 1 && top?.finalScore && candidates[1]?.finalScore) {
    const gap = top.finalScore - candidates[1].finalScore;
    if (gap >= 8) confidence = "High";
    else if (gap <= 3) confidence = "Low";
  }

  return { top, alternatives, confidence };
}
