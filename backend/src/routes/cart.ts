import express, { RequestHandler } from 'express';
import {
  getCart,
  addItem,
  removeItem,
  updateItemQuantity,
  clearCart,
} from '../controllers/cartController';
import { validateUserHeader } from '../middleware/validateUserHeader';

const router = express.Router();

// Apply user header validation to all routes
router.use(validateUserHeader as RequestHandler);

// Cart routes
router.get('/', getCart as RequestHandler);
router.post('/items', addItem as RequestHandler);
router.delete('/items/:itemId', removeItem as RequestHandler);
router.patch('/items/:itemId', updateItemQuantity as RequestHandler);
router.delete('/', clearCart as RequestHandler);

export default router;
