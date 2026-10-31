export interface PhoneScores {
  camera: number;
  battery: number;
  performance: number;
  display: number;
  software: number;
  build: number;
  value: number;
}

export interface Phone {
  id: string;
  brand: string;
  model: string;
  price_start: number;
  scores: PhoneScores;
  strengths: string[];
  weaknesses: string[];
  tags: string[];
  finalScore?: number;
}

export interface UserPreferences {
  budget_max: number;
  priorities: {
    camera: number;
    battery: number;
    performance: number;
    display: number;
    software: number;
    build: number;
    value: number;
  };
  deal_breakers: string[];
  preferred_brands: string[];
}
