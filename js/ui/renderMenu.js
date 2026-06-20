import { formatMoney } from '../core/dom.js';

export const renderCategoryGrid = (categories) => categories.map((cat) => `
  <button
    data-category-id="${cat.id}"
    class="category-card relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white text-left"
    aria-label="Ver ${cat.label}"
  >
    <div class="relative h-44 overflow-hidden" aria-hidden="true">
      <img
        src="${cat.cardImage}"
        alt=""
        class="w-full h-full object-cover"
        loading="lazy"
      >
      <div class="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-transparent"></div>
      <div class="absolute inset-x-0 top-0 p-4">
        <span class="block font-display font-bold text-xl leading-tight text-white">${cat.label}</span>
        <span class="block mt-1 text-xs font-semibold text-white/85">Ver productos</span>
      </div>
    </div>
  </button>
`).join('');

export const renderProductList = ({ products, getPriceLabel }) => products.map((product) => `
  <article class="product-card bg-white rounded-2xl p-4 border border-black/5 flex items-center gap-4">
    <div class="relative shrink-0">
      <img src="${product.image}" alt="Imagen de ${product.name}" class="w-24 h-24 rounded-xl object-cover bg-bgPrimary" loading="lazy">
    </div>
    <div class="flex-1 min-w-0">
      <h3 class="font-display font-bold text-lg leading-tight text-textPrimary truncate">${product.name}</h3>
      ${product.description ? `<p class="text-xs text-textSecondary mt-0.5 leading-relaxed line-clamp-2">${product.description}</p>` : ''}
      <div class="flex justify-between items-center mt-3">
        <span class="font-bold text-accent text-sm">${getPriceLabel(product)}</span>
        <button data-product-id="${product.id}" class="add-product-btn w-9 h-9 bg-primary text-textPrimary rounded-full flex items-center justify-center shrink-0" aria-label="Agregar ${product.name} al carrito">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </button>
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
