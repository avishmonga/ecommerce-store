import express, { RequestHandler } from 'express';
import {
  addItem,
  clearCart,
  getCart,
  removeItem,
  updateItemQuantity,
} from '../controllers/cartController';
import { validateUserId } from '../middleware/validateUserId';

const router = express.Router();

// Apply userId validation middleware to all routes
router.use('/:userId', validateUserId as RequestHandler);

// Create or get user's cart
router.get('/:userId', getCart as RequestHandler);

// Add item to cart
router.post('/:userId/items', addItem as RequestHandler);

// Remove item from cart
router.delete('/:userId/items/:itemId', removeItem as RequestHandler);

// Update item quantity
router.patch('/:userId/items/:itemId', updateItemQuantity as RequestHandler);

// Clear cart
router.delete('/:userId', clearCart as RequestHandler);

export default router;
