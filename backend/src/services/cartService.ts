import { memoryStore } from '../store/memoryStore';

export function getOrCreateCart(userId: string) {
  const userCart = memoryStore.carts.get(userId);

  if (!userCart) {
    const newCart = {
      userId,
      items: [],
    };
    memoryStore.carts.set(userId, newCart);
    return newCart;
  }

  return userCart;
}

export function addItemToCart(
  userId: string,
  item: { itemId: string; name: string; price: number; qty: number }
) {
  const userCart = memoryStore.carts.get(userId);
  if (!userCart) {
    throw new Error('Cart not found');
  }

  const existingItemIndex = userCart.items.findIndex(
    (cartItem) => cartItem.itemId === item.itemId
  );

  if (existingItemIndex > -1) {
    userCart.items[existingItemIndex].qty += item.qty;
  } else {
    userCart.items.push(item);
  }

  memoryStore.carts.set(userId, userCart);
  return userCart;
}

export function removeItemFromCart(userId: string, itemId: string) {
  const userCart = memoryStore.carts.get(userId);
  if (!userCart) {
    throw new Error('Cart not found');
  }

  userCart.items = userCart.items.filter((item) => item.itemId !== itemId);
  memoryStore.carts.set(userId, userCart);
  return userCart;
}

export function updateItemQuantity(
  userId: string,
  itemId: string,
  qty: number
) {
  if (qty < 0) {
    throw new Error('Invalid quantity');
  }

  const userCart = memoryStore.carts.get(userId);
  if (!userCart) {
    throw new Error('Cart not found');
  }

  const itemIndex = userCart.items.findIndex((item) => item.itemId === itemId);
  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }

  if (qty === 0) {
    userCart.items = userCart.items.filter((item) => item.itemId !== itemId);
  } else {
    userCart.items[itemIndex].qty = qty;
  }

  memoryStore.carts.set(userId, userCart);
  return userCart;
}

export function clearCart(userId: string) {
  const userCart = memoryStore.carts.get(userId);
  if (!userCart) {
    throw new Error('Cart not found');
  }

  userCart.items = [];
  memoryStore.carts.set(userId, userCart);
  return userCart;
}
