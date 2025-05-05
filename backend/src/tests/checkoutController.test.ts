import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import * as checkoutController from '../controllers/checkoutController';
import * as checkoutService from '../services/checkoutService';

describe('Checkout Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      userId: 'user123',
      body: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis() as unknown as (
        code: number
      ) => Response,
      json: jest.fn() as unknown as (body: any) => Response,
    };
    mockNext = jest.fn();
  });

  describe('checkout', () => {
    it('should process checkout successfully', async () => {
      const order = {
        orderId: 'order1',
        userId: 'user123',
        items: [],
        total: 100,
        discountApplied: false,
      };

      jest.spyOn(checkoutService, 'processCheckout').mockReturnValue(order);

      await checkoutController.checkout(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(order);
    });

    it('should handle cart not found error', async () => {
      jest.spyOn(checkoutService, 'processCheckout').mockImplementation(() => {
        throw new Error('Cart not found');
      });

      await checkoutController.checkout(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Cart not found',
      });
    });

    it('should handle cart empty error', async () => {
      jest.spyOn(checkoutService, 'processCheckout').mockImplementation(() => {
        throw new Error('Cart is empty');
      });

      await checkoutController.checkout(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Cart is empty',
      });
    });

    it('should handle invalid discount code error', async () => {
      jest.spyOn(checkoutService, 'processCheckout').mockImplementation(() => {
        throw new Error('Invalid or already used discount code');
      });

      await checkoutController.checkout(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid or already used discount code',
      });
    });
  });

  describe('generateDiscount', () => {
    it('should generate discount code successfully', async () => {
      const discountCode = {
        code: 'SUMMER2024',
        used: false,
        orderNumber: 5,
      };

      jest
        .spyOn(checkoutService, 'generateDiscountCode')
        .mockReturnValue(discountCode);

      mockRequest.body = { code: 'SUMMER2024' };

      await checkoutController.generateDiscount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(discountCode);
    });

    it('should handle missing code error', async () => {
      mockRequest.body = {};

      await checkoutController.generateDiscount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Discount code is not present',
      });
    });

    it('should handle no orders error', async () => {
      jest
        .spyOn(checkoutService, 'generateDiscountCode')
        .mockImplementation(() => {
          throw new Error(
            'No orders exist yet. Cannot generate discount code.'
          );
        });

      mockRequest.body = { code: 'SUMMER2024' };

      await checkoutController.generateDiscount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'No orders exist yet. Cannot generate discount code.',
      });
    });

    it('should handle invalid code format error', async () => {
      jest
        .spyOn(checkoutService, 'generateDiscountCode')
        .mockImplementation(() => {
          throw new Error(
            'Discount code must contain only uppercase letters and numbers'
          );
        });

      mockRequest.body = { code: 'summer-2024' };

      await checkoutController.generateDiscount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Discount code must contain only uppercase letters and numbers',
      });
    });
  });

  describe('getStats', () => {
    it('should return store stats successfully', async () => {
      const stats = {
        stats: {
          totalItemsPurchased: 10,
          totalPurchaseAmount: 1000,
          totalDiscountGiven: 100,
        },
        discountCodes: [],
        totalOrders: 5,
      };

      jest.spyOn(checkoutService, 'getStoreStats').mockReturnValue(stats);

      await checkoutController.getStats(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(stats);
    });
  });
});
