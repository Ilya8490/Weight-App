export type Gender = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'veryActive';

export interface MetricInput {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
}

export interface MetricEntry extends MetricInput {
  id: string;
  bmi: number;
  idealWeight: number;
  bmr: number;
  calories: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  user: User;
}

export interface MetricsSummary {
  latestEntry: MetricEntry | null;
  history: MetricEntry[];
  insight: string;
}
