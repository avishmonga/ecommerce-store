import { Request, Response, NextFunction } from 'express';
import * as checkoutService from '../services/checkoutService';

export async function checkout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const discountCode = req.body?.discountCode;
    const order = checkoutService.processCheckout(req.userId, discountCode);
    res.status(200).json(order);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Cart not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'Cart is empty') {
        res.status(400).json({ error: error.message });
        return;
      }
      if (error.message === 'Invalid or already used discount code') {
        res.status(400).json({ error: error.message });
        return;
      }
    }
    next(error);
  }
}

export async function generateDiscount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Check if code is present in request body
    if (!req.body?.code) {
      res.status(400).json({ error: 'Discount code is not present' });
      return;
    }

    const { code } = req.body;
    const discountCode = checkoutService.generateDiscountCode(code);
    res.status(200).json(discountCode);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'No orders exist yet. Cannot generate discount code.'
      ) {
        res.status(400).json({ error: error.message });
        return;
      }
      if (error.message.includes('Discount Code:')) {
        res.status(400).json({ error: error.message });
        return;
      }
      if (error.message.includes('Discount code can only be generated')) {
        res.status(400).json({ error: error.message });
        return;
      }
      if (
        error.message.includes(
          'Discount code must contain only uppercase letters and numbers'
        )
      ) {
        res.status(400).json({ error: error.message });
        return;
      }
      if (error.message.includes('Discount code already exists')) {
        res.status(400).json({ error: error.message });
        return;
      }
    }
    next(error);
  }
}

export async function getStats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const stats = checkoutService.getStoreStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
}

export async function getAvailableDiscount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const discountCode = checkoutService.getAvailableDiscountCode();
    if (!discountCode) {
      res.status(200).json({ message: 'Sorry no discount code available' });
      return;
    }
    res.status(200).json(discountCode);
  } catch (error) {
    next(error);
  }
}
