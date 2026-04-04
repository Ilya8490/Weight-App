import { buildMetrics, getInsightKey, type ActivityLevel, type Gender, type MetricEntry, type MetricInput } from '@health-metrics/shared';
import { prisma } from '../config/prisma.js';

interface DatabaseMetricEntry {
  id: string;
  userId: string;
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  bmi: number;
  idealWeight: number;
  bmr: number;
  calories: number;
  createdAt: Date;
}

export const createMetricEntry = async (userId: string, input: MetricInput) => {
  const metrics = buildMetrics(input);

  const entry = await prisma.metricEntry.create({
    data: {
      userId,
      weight: input.weight,
      height: input.height,
      age: input.age,
      gender: input.gender,
      activityLevel: input.activityLevel,
      bmi: metrics.bmi,
      idealWeight: metrics.idealWeight,
      bmr: metrics.bmr,
      calories: metrics.calories
    }
  });

  return {
    ...entry,
    gender: entry.gender as Gender,
    activityLevel: entry.activityLevel as ActivityLevel,
    createdAt: entry.createdAt.toISOString()
  };
};

export const getMetricHistory = async (userId: string) => {
  const history = await prisma.metricEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  });

  const serialized: MetricEntry[] = history.map((entry: DatabaseMetricEntry) => ({
    ...entry,
    gender: entry.gender as Gender,
    activityLevel: entry.activityLevel as ActivityLevel,
    createdAt: entry.createdAt.toISOString()
  }));

  const latestEntry = serialized.at(-1) ?? null;

  return {
    latestEntry,
    history: serialized,
    insight: latestEntry ? getInsightKey(latestEntry.bmi) : 'insights.empty'
  };
};
