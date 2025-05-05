import { memoryStore } from '../store/memoryStore';
import { v4 as uuidv4 } from 'uuid';

export function getAvailableDiscountCode() {
  // Check for unused discount codes
  const unusedCode = memoryStore.discountCodes.find((dc) => !dc.used);

  // If there's an unused code, check if it's expired (new nth order occurred)
  if (unusedCode) {
    const orderCount = memoryStore.orders.length;
    const n = 5; // Every 5th order gets a discount code

    // If we've passed the next nth order, mark the code as expired
    if (orderCount > unusedCode.orderNumber + n) {
      unusedCode.used = true; // Mark as used/expired
      return null;
    }

    return unusedCode;
  }

  // If no unused code exists, check if we should generate a new one
  const orderCount = memoryStore.orders.length;
  const n = 5; // Every 5th order gets a discount code

  if (orderCount > 0 && orderCount % n === 0) {
    // Generate new discount code
    const code = `DISCOUNT${orderCount}`;
    const discountCode = {
      code,
      used: false,
      orderNumber: orderCount,
    };

    memoryStore.discountCodes.push(discountCode);
    return discountCode;
  }

  return null;
}

export function processCheckout(userId: string, discountCode?: string) {
  const userCart = memoryStore.carts.get(userId);
  if (!userCart) {
    throw new Error('Cart not found');
  }

  if (userCart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  // Calculate total before discount
  const total = userCart.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  let finalTotal = total;
  let discountApplied = false;

  // Apply discount if code is provided
  if (discountCode) {
    const discount = memoryStore.discountCodes.find(
      (dc) => dc.code === discountCode && !dc.used
    );
    if (!discount) {
      throw new Error('Invalid or already used discount code');
    }

    // Check if code is expired (new nth order occurred)
    const orderCount = memoryStore.orders.length;
    const n = 5;
    if (orderCount > discount.orderNumber + n) {
      discount.used = true; // Mark as expired
      throw new Error('Discount code has expired');
    }

    // Apply 10% discount
    finalTotal = total * 0.9;
    discountApplied = true;
    discount.used = true;
  }

  // Create order
  const order: (typeof memoryStore.orders)[0] = {
    orderId: uuidv4(),
    userId,
    items: [...userCart.items],
    total: finalTotal,
    discountApplied,
    discountCode: discountApplied ? discountCode : undefined,
  };

  // Update stats
  memoryStore.stats.totalItemsPurchased += userCart.items.reduce(
    (sum, item) => sum + item.qty,
    0
  );
  memoryStore.stats.totalPurchaseAmount += finalTotal;
  if (discountApplied) {
    memoryStore.stats.totalDiscountGiven += total - finalTotal;
  }

  // Add order to history
  memoryStore.orders.push(order);

  // Clear the cart
  userCart.items = [];
  memoryStore.carts.set(userId, userCart);

  return order;
}

export function generateDiscountCode(customCode?: string) {
  const orderCount = memoryStore.orders.length;
  const n = 5; // Every 5th order gets a discount code

  if (orderCount === 0) {
    throw new Error('No orders exist yet. Cannot generate discount code.');
  }

  // Check if there's already a valid unused discount code
  const existingCode = memoryStore.discountCodes.find((dc) => !dc.used);
  if (existingCode) {
    throw new Error(`Discount Code: ${existingCode.code} is already available`);
  }

  if (orderCount % n !== 0) {
    throw new Error(
      `Discount code can only be generated after every ${n}th order`
    );
  }

  // Use custom code if provided, otherwise generate one
  const code = customCode || `DISCOUNT${orderCount}`;

  // Validate custom code format
  if (customCode && !/^[A-Z0-9]+$/.test(customCode)) {
    throw new Error(
      'Discount code must contain only uppercase letters and numbers'
    );
  }

  // Check if code already exists (used or unused)
  const codeExists = memoryStore.discountCodes.some((dc) => dc.code === code);
  if (codeExists) {
    throw new Error(`Discount code ${code} already exists`);
  }

  const discountCode = {
    code,
    used: false,
    orderNumber: orderCount,
  };

  memoryStore.discountCodes.push(discountCode);
  return discountCode;
}

export function getStoreStats() {
  return {
    stats: memoryStore.stats,
    discountCodes: memoryStore.discountCodes,
    totalOrders: memoryStore.orders.length,
  };
}
