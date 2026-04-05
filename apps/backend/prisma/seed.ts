import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { buildMetrics, type ActivityLevel, type Gender, type MetricInput } from '@health-metrics/shared';

const prisma = new PrismaClient();

const demoEmail = 'demo@healthmetrics.app';
const demoPassword = 'Demo123456';

const entries: Array<MetricInput & { createdAt: Date }> = [
  {
    weight: 84,
    height: 182,
    age: 29,
    gender: 'male',
    activityLevel: 'light',
    createdAt: new Date('2026-01-08T09:00:00.000Z')
  },
  {
    weight: 82.4,
    height: 182,
    age: 29,
    gender: 'male',
    activityLevel: 'moderate',
    createdAt: new Date('2026-01-29T09:00:00.000Z')
  },
  {
    weight: 80.9,
    height: 182,
    age: 29,
    gender: 'male',
    activityLevel: 'moderate',
    createdAt: new Date('2026-02-21T09:00:00.000Z')
  },
  {
    weight: 79.7,
    height: 182,
    age: 29,
    gender: 'male',
    activityLevel: 'active',
    createdAt: new Date('2026-03-14T09:00:00.000Z')
  },
  {
    weight: 78.8,
    height: 182,
    age: 29,
    gender: 'male',
    activityLevel: 'active',
    createdAt: new Date('2026-04-01T09:00:00.000Z')
  }
];

const normalizeEntry = (input: MetricInput & { createdAt: Date }) => {
  const metrics = buildMetrics(input);

  return {
    weight: input.weight,
    height: input.height,
    age: input.age,
    gender: input.gender as Gender,
    activityLevel: input.activityLevel as ActivityLevel,
    bmi: metrics.bmi,
    idealWeight: metrics.idealWeight,
    bmr: metrics.bmr,
    calories: metrics.calories,
    createdAt: input.createdAt
  };
};

async function main() {
  const hashedPassword = await bcrypt.hash(demoPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      password: hashedPassword
    },
    create: {
      email: demoEmail,
      password: hashedPassword
    }
  });

  await prisma.metricEntry.deleteMany({
    where: { userId: user.id }
  });

  await prisma.metricEntry.createMany({
    data: entries.map((entry) => ({
      userId: user.id,
      ...normalizeEntry(entry)
    }))
  });

  console.log(`Demo user ready: ${demoEmail}`);
  console.log(`Demo password: ${demoPassword}`);
}

main()
  .catch((error) => {
    console.error('Failed to seed demo data');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
