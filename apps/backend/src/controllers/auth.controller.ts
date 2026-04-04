import type { Request, Response } from 'express';
import { z } from 'zod';
import { clearAuthCookie, setAuthCookie } from '../utils/cookies.js';
import { signToken } from '../utils/jwt.js';
import { getUserById, loginUser, registerUser } from '../services/auth.service.js';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = authSchema.parse(req.body);
    const user = await registerUser(email, password);
    setAuthCookie(res, signToken(user.id));
    return res.status(201).json({ user });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Unable to register'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = authSchema.parse(req.body);
    const user = await loginUser(email, password);
    setAuthCookie(res, signToken(user.id));
    return res.json({ user });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Unable to login'
    });
  }
};

export const logout = (_req: Request, res: Response) => {
  clearAuthCookie(res);
  return res.json({ success: true });
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await getUserById(req.user.id);
  return res.json({ user });
};
