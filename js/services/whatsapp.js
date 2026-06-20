import { formatMoney } from '../core/dom.js';
import { MAX_ADDRESS_LENGTH, MAX_COMMENTS_LENGTH, limitText } from '../security/validate.js';

export const buildWhatsAppMessage = ({ storeConfig, cart, address, notes }) => {
  let grandTotal = 0;
  const safeAddress = limitText(address, MAX_ADDRESS_LENGTH);
  const safeNotes = limitText(notes, MAX_COMMENTS_LENGTH);
  let message = `*NUEVO PEDIDO - ${storeConfig.name.toUpperCase()}*\n\n`;
  message += `Direccion: ${safeAddress}\n`;
  if (safeNotes) message += `Notas: ${safeNotes}\n`;
  message += `\n*DETALLE DEL PEDIDO:*\n\n`;

  cart.forEach((item) => {
    grandTotal += item.unitPrice * item.qty;
    message += `${item.qty}x ${item.name}`;
    if (item.config?.base) message += ` - En ${item.config.base}`;
    if (item.config?.isGranizado) message += ` - Granizado`;
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
