import { formatMoney } from '../core/dom.js';
import { escapeHtml } from '../security/sanitize.js';

export const renderCategoryGrid = (categories) => categories.map((cat) => `
  <button
    data-category-id="${escapeHtml(cat.id)}"
    class="category-card relative flex flex-col overflow-hidden rounded-md bg-white text-left"
    aria-label="Ver ${escapeHtml(cat.label)}"
  >
    <div class="relative h-36 overflow-hidden" aria-hidden="true">
      <img
        src="${escapeHtml(cat.cardImage)}"
        alt=""
        class="w-full h-full object-cover"
        loading="lazy"
      >
      <div class="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-transparent"></div>
      <div class="absolute inset-x-0 top-0 p-3">
        <span class="block font-display font-bold text-lg leading-tight text-white">${escapeHtml(cat.label)}</span>
        <span class="block mt-1 text-[11px] font-semibold text-white/85">Ver productos</span>
      </div>
    </div>
  </button>
`).join('');

export const renderProductList = ({ products, getPriceLabel }) => products.map((product) => `
  <article class="product-card bg-white rounded-md p-3">
    <div class="min-w-0">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <h3 class="font-display font-bold text-[1.05rem] leading-tight text-textPrimary truncate">${escapeHtml(product.name)}</h3>
          ${product.description ? `<p class="text-xs text-textSecondary mt-0.5 leading-relaxed line-clamp-2">${escapeHtml(product.description)}</p>` : ''}
        </div>
        <button data-product-id="${product.id}" class="add-product-btn w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center shrink-0" aria-label="Agregar ${escapeHtml(product.name)} al carrito">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </button>
      </div>
      <div class="flex justify-between items-center mt-2">
        <span class="font-bold text-accent text-sm">${getPriceLabel(product)}</span>
      </div>
    </div>
  </article>
`).join('');

export const getProductPriceLabel = ({ product, heladoSizes }) => {
  if (product.type === 'jugo' || product.type === 'combinado') {
    const basePrice = product.pAgua !== null ? product.pAgua : product.pLeche;
    return `Desde ${formatMoney(basePrice)}`;
  }
  if (product.type === 'helado') {
    return `Desde ${formatMoney(heladoSizes[0].price)}`;
  }
  return formatMoney(product.price);
};
