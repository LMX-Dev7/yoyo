import { formatMoney } from '../core/dom.js';
import { escapeHtml } from '../security/sanitize.js';

export const renderCartItems = (cart) => {
  if (!cart.length) {
    return `
      <div class="flex flex-col items-center justify-center py-16 text-textSecondary">
        <svg class="w-16 h-16 mb-4 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <p class="font-display font-bold text-lg text-textSecondary">Tu carrito esta vacio</p>
        <p class="text-sm text-textSecondary mt-1">Agrega productos del menu para comenzar.</p>
      </div>
    `;
  }

  return cart.map((item, index) => {
    let configBadges = '';
    if (item.config?.base) configBadges += `<span class="config-badge">En ${escapeHtml(item.config.base)}</span>`;
    if (item.config?.isGranizado) configBadges += `<span class="config-badge">Granizado</span>`;
    if (item.config?.hSize) configBadges += `<span class="config-badge">${escapeHtml(item.config.hSize)}</span>`;

    let extraText = '';
    if (item.config?.frutasText) extraText += `<p class="text-xs text-textSecondary mt-1">Frutas: ${escapeHtml(item.config.frutasText)}</p>`;
    if (item.config?.hFlavor?.length) extraText += `<p class="text-xs text-textSecondary mt-1">Sabores: ${escapeHtml(item.config.hFlavor.join(', '))}</p>`;
    if (item.config?.toppings?.length) extraText += `<p class="text-xs font-semibold text-accent mt-1">Toppings: ${escapeHtml(item.config.toppings.join(', '))}</p>`;

    return `
      <article class="bg-white p-4 rounded-2xl border border-black/5 relative" data-cart-index="${index}">
        <button class="remove-item-btn absolute top-4 right-4 text-textSecondary" data-index="${index}" aria-label="Eliminar ${escapeHtml(item.name)} del carrito">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
        <h4 class="font-display font-bold text-textPrimary pr-8 mb-1">${escapeHtml(item.name)}</h4>
        ${configBadges ? `<div class="flex flex-wrap gap-1 mb-1">${configBadges}</div>` : ''}
        ${extraText}
        <div class="flex justify-between items-center mt-3 pt-3 border-t border-black/5">
          <span class="font-bold text-accent">${formatMoney(item.unitPrice * item.qty)}</span>
          <div class="qty-controls flex items-center bg-bgPrimary rounded-xl p-1 border border-black/5">
            <button class="decrease-qty-btn w-7 h-7 flex items-center justify-center text-textSecondary font-bold" data-index="${index}" aria-label="Reducir cantidad">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"/></svg>
            </button>
            <span class="text-sm font-bold w-6 text-center text-textPrimary">${item.qty}</span>
            <button class="increase-qty-btn w-7 h-7 flex items-center justify-center text-primary font-bold" data-index="${index}" aria-label="Aumentar cantidad">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
};
