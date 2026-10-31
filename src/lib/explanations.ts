import { Phone, UserPreferences } from "./types";

export function generateExplanation(
  top: Phone,
  alternatives: Phone[],
  prefs: UserPreferences
): string {
  const reasons: string[] = [];

  // Find user's top priority
  const sortedPriorities = Object.entries(prefs.priorities).sort(
    (a, b) => b[1] - a[1]
  );
  const topPriority = sortedPriorities[0][0];
  const topPriorityLabel =
    topPriority.charAt(0).toUpperCase() + topPriority.slice(1);

  reasons.push(`It scores highest on your top priority: ${topPriorityLabel}.`);

  // Clear advantages
  if (alternatives.length > 0) {
    const rival = alternatives[0];

    if (top.scores.camera >= rival.scores.camera + 6) {
      reasons.push(
        "Noticeably better camera performance than the closest alternative."
      );
    }
    if (top.scores.battery >= rival.scores.battery + 6) {
      reasons.push("Significantly stronger battery life.");
    }
    if (top.scores.software >= 95) {
      reasons.push("Excellent long-term software support.");
    }
    if (top.scores.value >= 90) {
      reasons.push("Outstanding value for the price.");
    }
  }

  // Acknowledge a trade-off
  const scores = top.scores;
  const weakest = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
  const weakestLabel = weakest.charAt(0).toUpperCase() + weakest.slice(1);
  reasons.push(`Trade-off: It is relatively weaker in ${weakestLabel}.`);

  return reasons.join(" ");
}
