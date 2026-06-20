export const getCartCount = (cart) => cart.reduce((sum, item) => sum + (item.qty || 0), 0);

export const getCartTotal = (cart) => cart.reduce((sum, item) => sum + ((item.unitPrice || 0) * (item.qty || 0)), 0);

export const addCartItem = (cart, item) => [...cart, item];

export const updateCartQty = (cart, index, delta) =>
  cart
    .map((item, i) => (i === index ? { ...item, qty: item.qty + delta } : item))
    .filter((item) => item.qty > 0);

export const removeCartItem = (cart, index) => cart.filter((_, i) => i !== index);
