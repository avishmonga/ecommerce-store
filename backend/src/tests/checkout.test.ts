import { describe, it, expect, beforeEach } from '@jest/globals';
import * as checkoutService from '../services/checkoutService';
import { memoryStore } from '../store/memoryStore';

describe('Checkout Service', () => {
  beforeEach(() => {
    // Clear the store before each test
    memoryStore.carts.clear();
    memoryStore.orders = [];
    memoryStore.discountCodes = [];
    memoryStore.stats = {
      totalItemsPurchased: 0,
      totalPurchaseAmount: 0,
      totalDiscountGiven: 0,
    };
  });

  describe('processCheckout', () => {
    it('should throw error if cart not found', () => {
      expect(() => checkoutService.processCheckout('user123')).toThrow(
        'Cart not found'
      );
    });

    it('should throw error if cart is empty', () => {
      // Create empty cart
      memoryStore.carts.set('user123', { userId: 'user123', items: [] });
      expect(() => checkoutService.processCheckout('user123')).toThrow(
        'Cart is empty'
      );
    });

    it('should process checkout successfully', () => {
      // Create cart with items
      memoryStore.carts.set('user123', {
        userId: 'user123',
        items: [{ itemId: 'item1', name: 'Product 1', price: 29.99, qty: 2 }],
      });

      const order = checkoutService.processCheckout('user123');
      expect(order).toMatchObject({
        userId: 'user123',
        items: [{ itemId: 'item1', name: 'Product 1', price: 29.99, qty: 2 }],
        total: 59.98,
        discountApplied: false,
      });
    });

    it('should apply discount if valid code provided', () => {
      // Create cart with items
      memoryStore.carts.set('user123', {
        userId: 'user123',
        items: [{ itemId: 'item1', name: 'Product 1', price: 29.99, qty: 2 }],
      });

      // Create discount code
      memoryStore.discountCodes.push({
        code: 'DISCOUNT10',
        used: false,
        orderNumber: 5,
      });

      const order = checkoutService.processCheckout('user123', 'DISCOUNT10');
      expect(order).toMatchObject({
        userId: 'user123',
        total: 53.982, // 10% discount applied
        discountApplied: true,
        discountCode: 'DISCOUNT10',
      });
    });

    it('should throw error if invalid discount code provided', () => {
      memoryStore.carts.set('user123', {
        userId: 'user123',
        items: [{ itemId: 'item1', name: 'Product 1', price: 29.99, qty: 2 }],
      });

      expect(() =>
        checkoutService.processCheckout('user123', 'INVALID')
      ).toThrow('Invalid or already used discount code');
    });
  });

  describe('generateDiscountCode', () => {
    it('should throw error if no orders exist', () => {
      expect(() => checkoutService.generateDiscountCode()).toThrow(
        'No orders exist yet. Cannot generate discount code.'
      );
    });

    it('should throw error if not nth order', () => {
      // Create some orders
      for (let i = 0; i < 3; i++) {
        memoryStore.orders.push({
          orderId: `order${i}`,
          userId: 'user123',
          items: [],
          total: 100,
          discountApplied: false,
        });
      }

      expect(() => checkoutService.generateDiscountCode()).toThrow(
        'Discount code can only be generated after every 5th order'
      );
    });

    it('should generate discount code on nth order', () => {
      // Create 5 orders
      for (let i = 0; i < 5; i++) {
        memoryStore.orders.push({
          orderId: `order${i}`,
          userId: 'user123',
          items: [],
          total: 100,
          discountApplied: false,
        });
      }

      const discountCode = checkoutService.generateDiscountCode();
      expect(discountCode).toMatchObject({
        code: 'DISCOUNT5',
        used: false,
        orderNumber: 5,
      });
    });

    it('should accept custom discount code', () => {
      // Create 5 orders
      for (let i = 0; i < 5; i++) {
        memoryStore.orders.push({
          orderId: `order${i}`,
          userId: 'user123',
          items: [],
          total: 100,
          discountApplied: false,
        });
      }

      const discountCode = checkoutService.generateDiscountCode('SUMMER2024');
      expect(discountCode).toMatchObject({
        code: 'SUMMER2024',
        used: false,
        orderNumber: 5,
      });
    });

    it('should throw error if custom code contains invalid characters', () => {
      // Create 5 orders
      for (let i = 0; i < 5; i++) {
        memoryStore.orders.push({
          orderId: `order${i}`,
          userId: 'user123',
          items: [],
          total: 100,
          discountApplied: false,
        });
      }

      expect(() => checkoutService.generateDiscountCode('summer-2024')).toThrow(
        'Discount code must contain only uppercase letters and numbers'
      );
    });

    it('should throw error if code already exists', () => {
      // Create 5 orders
      for (let i = 0; i < 5; i++) {
        memoryStore.orders.push({
          orderId: `order${i}`,
          userId: 'user123',
          items: [],
          total: 100,
          discountApplied: false,
        });
      }

      // Add existing code
      memoryStore.discountCodes.push({
        code: 'SUMMER2024',
        used: false,
        orderNumber: 5,
      });

      expect(() => checkoutService.generateDiscountCode('SUMMER2024')).toThrow(
        'Discount Code: SUMMER2024 is already available'
      );
    });
  });

  describe('getStoreStats', () => {
    it('should return initial stats when no orders exist', () => {
      const stats = checkoutService.getStoreStats();
      expect(stats).toMatchObject({
        stats: {
          totalItemsPurchased: 0,
          totalPurchaseAmount: 0,
          totalDiscountGiven: 0,
        },
        discountCodes: [],
        totalOrders: 0,
      });
    });

    it('should return correct stats after orders', () => {
      // Create some orders with discounts
      memoryStore.orders.push({
        orderId: 'order1',
        userId: 'user123',
        items: [{ itemId: 'item1', name: 'Product 1', price: 100, qty: 2 }],
        total: 180, // 10% discount
        discountApplied: true,
        discountCode: 'DISCOUNT5',
      });

      memoryStore.stats.totalItemsPurchased = 2;
      memoryStore.stats.totalPurchaseAmount = 180;
      memoryStore.stats.totalDiscountGiven = 20;

      const stats = checkoutService.getStoreStats();
      expect(stats).toMatchObject({
        stats: {
          totalItemsPurchased: 2,
          totalPurchaseAmount: 180,
          totalDiscountGiven: 20,
        },
        totalOrders: 1,
      });
    });
  });
});
