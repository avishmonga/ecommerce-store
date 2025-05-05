import { Request, Response, NextFunction } from 'express';

const ADMIN_USER_ID = 'user123';

export function validateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const userId = req.headers['x-user-id'];

  if (!userId || userId !== ADMIN_USER_ID) {
    res
      .status(403)
      .json({ error: 'Access denied. Admin privileges required.' });
    return;
  }

  next();
}
