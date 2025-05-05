import express, { RequestHandler } from 'express';
import {
  checkout,
  generateDiscount,
  getStats,
  getAvailableDiscount,
} from '../controllers/checkoutController';
import { validateUserHeader } from '../middleware/validateUserHeader';
import { validateAdmin } from '../middleware/validateAdmin';

const router = express.Router();

// Checkout routes
router.post(
  '/',
  validateUserHeader as RequestHandler,
  checkout as RequestHandler
);
router.get(
  '/discount',
  validateUserHeader as RequestHandler,
  getAvailableDiscount as RequestHandler
);

// Admin routes
router.post(
  '/admin/discount',
  validateAdmin as RequestHandler,
  generateDiscount as RequestHandler
);
router.get(
  '/admin/stats',
  validateAdmin as RequestHandler,
  getStats as RequestHandler
);

export default router;
