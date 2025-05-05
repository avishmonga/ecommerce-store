import { Request, Response, NextFunction } from 'express';

export function validateUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (typeof userId !== 'string' || userId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid User ID format' });
  }

  // Add the validated userId to the request for later use
  req.params.userId = userId.trim();
  next();
}
