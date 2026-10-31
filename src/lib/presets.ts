import { UserPreferences } from "./types";

export type Priorities = UserPreferences["priorities"];

export interface PriorityPreset {
  id: string;
  label: string;
  description: string;
  priorities: Priorities;
}

/**
 * One-tap starting points for the priority sliders. Every set sums to 100,
 * because the scorer divides the weighted total by 100.
 */
export const PRIORITY_PRESETS: PriorityPreset[] = [
  {
    id: "balanced",
    label: "Balanced",
    description: "A bit of everything",
    priorities: {
      camera: 20,
      battery: 20,
      performance: 15,
      display: 10,
      software: 15,
      build: 10,
      value: 10,
    },
  },
  {
    id: "photographer",
    label: "Photographer",
    description: "Camera first",
    priorities: {
      camera: 40,
      battery: 10,
      performance: 15,
      display: 15,
      software: 10,
      build: 5,
      value: 5,
    },
  },
  {
    id: "gamer",
    label: "Gamer",
    description: "Speed and screen",
    priorities: {
      camera: 5,
      battery: 15,
      performance: 40,
      display: 20,
      software: 10,
      build: 5,
      value: 5,
    },
  },
  {
    id: "battery",
    label: "All-day battery",
    description: "Lasts longest",
    priorities: {
      camera: 10,
      battery: 40,
      performance: 10,
      display: 10,
      software: 15,
      build: 5,
      value: 10,
    },
  },
  {
    id: "budget",
    label: "Tight budget",
    description: "Most phone per rupee",
    priorities: {
      camera: 10,
      battery: 15,
      performance: 10,
      display: 10,
      software: 10,
      build: 5,
      value: 40,
    },
  },
];
