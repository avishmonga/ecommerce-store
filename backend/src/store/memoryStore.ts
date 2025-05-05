interface CartItem {
  itemId: string;
  name: string;
  price: number;
  qty: number;
}

interface UserCart {
  userId: string;
  items: CartItem[];
}

interface Order {
  orderId: string;
  userId: string;
  items: CartItem[];
  total: number;
  discountApplied: boolean;
  discountCode?: string;
}

interface DiscountCode {
  code: string;
  used: boolean;
  orderNumber: number; // helps us how many orders we have processed so far
}

interface Stats {
  totalItemsPurchased: number;
  totalPurchaseAmount: number;
  totalDiscountGiven: number;
}

export const memoryStore = {
  carts: new Map<string, UserCart>(), 
  orders: [] as Order[],
  discountCodes: [] as DiscountCode[],
  stats: {
    totalItemsPurchased: 0,
    totalPurchaseAmount: 0,
    totalDiscountGiven: 0,
  } as Stats,
};