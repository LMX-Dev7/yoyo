const CART_KEY = 'yoyo.cart.v1';

export const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};
