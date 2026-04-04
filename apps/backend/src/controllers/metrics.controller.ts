import type { Request, Response } from 'express';
import { z } from 'zod';
import { createMetricEntry, getMetricHistory } from '../services/metrics.service.js';

const metricEntrySchema = z.object({
  weight: z.number().min(1).max(500),
  height: z.number().min(50).max(300),
  age: z.number().min(1).max(120),
  gender: z.enum(['male', 'female']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'veryActive'])
});

export const createEntry = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = metricEntrySchema.parse(req.body);
    const entry = await createMetricEntry(req.user.id, payload);
    return res.status(201).json({ entry });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Unable to save entry'
    });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const metrics = await getMetricHistory(req.user.id);
  return res.json(metrics);
};
