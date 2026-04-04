import type { ActivityLevel, MetricInput } from './types';

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9
};

const round = (value: number) => Number(value.toFixed(1));

export const calculateBMI = (weight: number, heightCm: number) => {
  const heightMeters = heightCm / 100;
  return round(weight / (heightMeters * heightMeters));
};

export const calculateIdealWeight = (heightCm: number, gender: MetricInput['gender']) => {
  const heightInches = heightCm / 2.54;
  const base = gender === 'male' ? 50 : 45.5;
  const extra = Math.max(heightInches - 60, 0) * 2.3;
  return round(base + extra);
};

export const calculateBMR = ({ weight, height, age, gender }: MetricInput) => {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return round(gender === 'male' ? base + 5 : base - 161);
};

export const calculateDailyCalories = (input: MetricInput) => {
  const bmr = calculateBMR(input);
  return round(bmr * activityMultipliers[input.activityLevel]);
};

export const buildMetrics = (input: MetricInput) => {
  const bmi = calculateBMI(input.weight, input.height);
  const idealWeight = calculateIdealWeight(input.height, input.gender);
  const bmr = calculateBMR(input);
  const calories = calculateDailyCalories(input);

  return {
    bmi,
    idealWeight,
    bmr,
    calories
  };
};

export const getBMIStatus = (bmi: number) => {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'healthy';
  if (bmi < 30) return 'overweight';
  return 'obese';
};

export const getInsightKey = (bmi: number) => {
  if (bmi < 18.5) return 'insights.underweight';
  if (bmi > 25) return 'insights.overweight';
  return 'insights.healthy';
};
