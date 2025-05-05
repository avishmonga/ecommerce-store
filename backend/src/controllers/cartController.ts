import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cartService';

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export async function getCart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const cart = cartService.getOrCreateCart(req.userId);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function addItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { itemId, name, price, qty } = req.body;
    if (!itemId || !name || !price || !qty) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const item = { itemId, name, price, qty };
    const cart = cartService.addItemToCart(req.userId, item);
    res.status(200).json(cart);
  } catch (error) {
    if (error instanceof Error && error.message === 'Cart not found') {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
}

export async function removeItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { itemId } = req.params;
    const cart = cartService.removeItemFromCart(req.userId, itemId);
    res.status(200).json(cart);
  } catch (error) {
    if (error instanceof Error && error.message === 'Cart not found') {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
}

export async function updateItemQuantity(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { itemId } = req.params;
    const { qty } = req.body;
    if (!qty || qty < 0) {
      res.status(400).json({ error: 'Invalid quantity' });
      return;
    }
    const cart = cartService.updateItemQuantity(req.userId, itemId, qty);
    res.status(200).json(cart);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'Cart not found' ||
        error.message === 'Item not found in cart'
      ) {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'Invalid quantity') {
        res.status(400).json({ error: error.message });
        return;
      }
    }
    next(error);
  }
}

export async function clearCart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const cart = cartService.clearCart(req.userId);
    res.status(200).json(cart);
  } catch (error) {
    if (error instanceof Error && error.message === 'Cart not found') {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
}
