import { Router } from 'express';
import { createEntry, getHistory } from '../controllers/metrics.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const metricsRouter = Router();

metricsRouter.use(requireAuth);
metricsRouter.get('/history', getHistory);
metricsRouter.post('/entry', createEntry);
