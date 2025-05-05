import { Request, Response, NextFunction } from 'express';

export function validateUserHeader(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const userId = req.headers['x-user-id'];

  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    res.status(400).json({ error: 'User ID is required in x-user-id header' });
    return;
  }

  // Add the validated userId to the request for use in controllers
  req.userId = userId.trim();
  next();
}
