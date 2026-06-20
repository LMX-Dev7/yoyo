import { formatMoney } from '../core/dom.js';

export const buildWhatsAppMessage = ({ storeConfig, cart, address, notes }) => {
  let grandTotal = 0;
  let message = `*NUEVO PEDIDO â€” ${storeConfig.name.toUpperCase()}*\n\n`;
  message += `Direccion: ${address}\n`;
  if (notes) message += `Notas: ${notes}\n`;
  message += `\n*DETALLE DEL PEDIDO:*\n\n`;

  cart.forEach((item) => {
    grandTotal += item.unitPrice * item.qty;
    message += `${item.qty}x ${item.name}`;
    if (item.config?.base) message += ` â€” En ${item.config.base}`;
    if (item.config?.isGranizado) message += ` â€” Granizado`;
    if (item.config?.frutasText) message += `\n   Frutas: ${item.config.frutasText}`;
    if (item.config?.hSize) message += `\n   Tamano: ${item.config.hSize}`;
    if (item.config?.hFlavor?.length) message += `\n   Sabores: ${item.config.hFlavor.join(', ')}`;
    if (item.config?.toppings?.length) message += `\n   Toppings: ${item.config.toppings.join(', ')}`;
    message += `\n   Subtotal: ${formatMoney(item.unitPrice * item.qty)}\n\n`;
  });

  message += `*TOTAL PRODUCTOS: ${formatMoney(grandTotal)}*\n`;
  message += `Domicilio: ${storeConfig.deliveryFeeText}`;
  return message;
};

export const openWhatsApp = (phone, message) => {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};
