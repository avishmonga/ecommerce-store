import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cartService';

export async function getCart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req.params;
    const cart = cartService.getOrCreateCart(userId);
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
    const { userId } = req.params;
    const { itemId, name, price, qty } = req.body;

    if (!itemId || !name || !price || !qty) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const item = { itemId, name, price, qty };
    const cart = cartService.addItemToCart(userId, item);
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
    const { userId, itemId } = req.params;
    const cart = cartService.removeItemFromCart(userId, itemId);
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
    const { userId, itemId } = req.params;
    const { qty } = req.body;

    if (!qty || qty < 0) {
      res.status(400).json({ error: 'Invalid quantity' });
      return;
    }

    const cart = cartService.updateItemQuantity(userId, itemId, qty);
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
    const { userId } = req.params;
    const cart = cartService.clearCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    if (error instanceof Error && error.message === 'Cart not found') {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
}
