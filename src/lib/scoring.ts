import { Phone, UserPreferences } from "./types";

/**
 * A preferred brand is a nudge, not a filter: it can lift a phone above a
 * close rival but cannot drag an unsuitable phone to the top on its own.
 */
export const PREFERRED_BRAND_BOOST = 6;

/**
 * The weighted score for one phone, on the same 0-100 scale as the attribute
 * scores. Shared by the results page and the phone detail page so the number a
 * user sees in the list is the number they see when they open the phone.
 */
export function weightedScore(phone: Phone, prefs: UserPreferences): number {
  const p = prefs.priorities;
  const s = phone.scores;

  const raw =
    (s.camera * p.camera +
      s.battery * p.battery +
      s.performance * p.performance +
      s.display * p.display +
      s.software * p.software +
      s.build * p.build +
      s.value * p.value) /
    100;

  const preferred = (prefs.preferred_brands || []).includes(phone.brand)
    ? PREFERRED_BRAND_BOOST
    : 0;

  return Math.min(100, Math.round((raw + preferred) * 10) / 10);
}

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

  // 2. Score
  candidates = candidates.map((phone) => ({
    ...phone,
    finalScore: weightedScore(phone, prefs),
  }));

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
