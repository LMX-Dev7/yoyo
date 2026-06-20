import { storeConfig } from '../config/store.js';
import { $ } from '../core/dom.js';
import { state } from '../core/state.js';
import { loadCart, saveCart } from '../core/storage.js';
import { getCartTotal, removeCartItem, updateCartQty } from '../core/cart.js';
import { renderHeader } from '../ui/renderHeader.js';
import { renderFooter } from '../ui/renderFooter.js';
import { renderCartItems } from '../ui/renderCart.js';
import { buildWhatsAppMessage, openWhatsApp } from '../services/whatsapp.js';

const renderShell = () => {
  const header = $('app-header');
  const footer = $('app-footer');
  if (header) header.innerHTML = renderHeader({ title: 'Tu Pedido', subtitle: 'Revisa tu carrito y envia por WhatsApp', backHref: 'menu.html' });
  if (footer) footer.innerHTML = renderFooter({ text: storeConfig.openingHours });
};

const renderPage = () => {
  const items = $('cart-items');
  if (items) items.innerHTML = renderCartItems(state.cart);
  const checkout = $('checkout-form');
  const sendBtn = $('btn-send-order');
  if (checkout) checkout.classList.toggle('hidden', state.cart.length === 0);
  if (sendBtn) sendBtn.disabled = state.cart.length === 0;
  const totalEl = $('cart-total-price');
  if (totalEl) totalEl.textContent = `$${getCartTotal(state.cart).toLocaleString('es-CO')}`;
};

export const initCarritoPage = () => {
  state.cart = loadCart();
  renderShell();
  renderPage();

  const items = $('cart-items');
  if (items) {
    items.addEventListener('click', (event) => {
      const removeBtn = event.target.closest('.remove-item-btn');
      if (removeBtn) {
        state.cart = removeCartItem(state.cart, Number(removeBtn.dataset.index));
        saveCart(state.cart);
        renderPage();
        return;
      }

      const decreaseBtn = event.target.closest('.decrease-qty-btn');
      if (decreaseBtn) {
        state.cart = updateCartQty(state.cart, Number(decreaseBtn.dataset.index), -1);
        saveCart(state.cart);
        renderPage();
        return;
      }

      const increaseBtn = event.target.closest('.increase-qty-btn');
      if (increaseBtn) {
        state.cart = updateCartQty(state.cart, Number(increaseBtn.dataset.index), 1);
        saveCart(state.cart);
        renderPage();
      }
    });
  }

  const sendBtn = $('btn-send-order');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const addressInput = $('cart-address');
      const notesInput = $('cart-notes');
      const addressError = $('address-error');
      const address = addressInput ? addressInput.value.trim() : '';
      const notes = notesInput ? notesInput.value.trim() : '';
      if (!address) {
        if (addressInput) addressInput.classList.add('border-red-400');
        if (addressError) addressError.classList.remove('hidden');
        return;
      }
      if (addressInput) addressInput.classList.remove('border-red-400');
      if (addressError) addressError.classList.add('hidden');
      saveCart(state.cart);
      const message = buildWhatsAppMessage({ storeConfig, cart: state.cart, address, notes });
      openWhatsApp(storeConfig.whatsappPhone, message);
    });
  }

  const addressInput = $('cart-address');
  if (addressInput) {
    addressInput.addEventListener('input', () => {
      addressInput.classList.remove('border-red-400');
      const err = $('address-error');
      if (err) err.classList.add('hidden');
    });
  }
};
