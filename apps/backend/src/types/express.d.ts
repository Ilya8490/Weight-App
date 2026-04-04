import type { User } from '@health-metrics/shared';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
