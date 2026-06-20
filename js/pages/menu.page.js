import { categories, products, heladoSizes, toppings, sabores } from '../config/store.js';
import { $, $$, formatMoney } from '../core/dom.js';
import { state } from '../core/state.js';
import { loadCart, saveCart } from '../core/storage.js';
import { addCartItem, getCartCount } from '../core/cart.js';
import { renderCategoryGrid, renderProductList, getProductPriceLabel } from '../ui/renderMenu.js';
import { renderModalShell, renderRadioCard } from '../ui/renderModal.js';

const showToast = (message, duration = 2500) => {
  const existing = document.querySelector('.app-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'app-toast';
  toast.setAttribute('role', 'alert');
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('app-toast--visible'));
  setTimeout(() => {
    toast.classList.remove('app-toast--visible');
    setTimeout(() => toast.remove(), 400);
  }, duration);
};

const updateCartBadge = () => {
  const badge = $('cart-badge');
  if (badge) {
    const count = getCartCount(state.cart);
    badge.textContent = String(count);
    badge.classList.toggle('hidden', count === 0);
  }
};

const showForm = (id) => {
  const el = $(id);
  if (el) el.classList.remove('hidden');
};

const hideForms = () => ['form-frutas', 'form-base', 'form-granizado', 'form-helado-size', 'form-helado-flavor', 'form-toppings'].forEach((id) => {
  const el = $(id);
  if (el) el.classList.add('hidden');
});

const buildBaseOptions = (product) => {
  const container = $('base-options');
  if (!container) return;
  let html = '';
  if (product.pAgua !== null && product.restrict !== 'Leche') html += renderRadioCard('m_base', 'Agua', product.pAgua, 'Agua', formatMoney(product.pAgua));
  if (product.pLeche !== null && product.restrict !== 'Agua') html += renderRadioCard('m_base', 'Leche', product.pLeche, 'Leche', formatMoney(product.pLeche));
  container.innerHTML = html;
};

const buildFresasOptions = (product) => {
  const container = $('base-options');
  const label = $('label-base');
  if (label) label.innerHTML = `Aderezo <span class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-2 uppercase tracking-wider">Obligatorio</span>`;
  if (container) {
    const priceLabel = formatMoney(product.price);
    container.innerHTML =
      renderRadioCard('m_base', 'Leche Condensada', product.price, 'Leche Condensada', priceLabel) +
      renderRadioCard('m_base', 'Arequipe', product.price, 'Arequipe', priceLabel);
  }
};

const buildHeladoSizes = () => {
  const container = $('helado-sizes-container');
  if (!container) return;
  container.innerHTML = heladoSizes.map((size) => `
    <label class="size-option border-2 border-primary/20 rounded-2xl p-3 flex justify-between items-center cursor-pointer hover:border-primary transition-colors duration-200 has-[:checked]:border-primary has-[:checked]:bg-primary/12">
      <div class="flex items-center gap-3">
        <input type="radio" name="h_size" value="${size.id}" data-price="${size.price}" data-max="${size.maxSabores}" class="w-4 h-4" style="accent-color: var(--color-primary);">
        <span class="font-semibold text-sm text-textPrimary">${size.name}</span>
      </div>
      <span class="text-accent text-sm font-bold">${formatMoney(size.price)}</span>
    </label>
  `).join('');
};

const buildFlavorOptions = (isMalteada) => {
  const container = $('helado-flavors-container');
  const hint = $('flavor-hint');
  if (!container) return;
  if (hint) hint.textContent = isMalteada ? 'Selecciona 1 sabor para tu malteada.' : 'Sabores disponibles segun la presentacion elegida.';
  const inputType = isMalteada ? 'radio' : 'checkbox';
  container.innerHTML = sabores.map((flavor) => `
    <label class="border-2 border-primary/20 rounded-2xl p-3 flex items-center justify-center gap-2 cursor-pointer hover:border-primary transition-colors duration-200 has-[:checked]:border-primary has-[:checked]:bg-primary/12 text-center">
      <input type="${inputType}" name="h_flavor" value="${flavor}" class="hidden">
      <span class="font-semibold text-sm text-textPrimary">${flavor}</span>
    </label>
  `).join('');
};

const buildToppings = () => {
  const container = $('toppings-container');
  if (!container) return;
  container.innerHTML = toppings.map((top) => `
    <label class="granizado-toggle" for="top-${top.id}">
      <div>
        <span class="flex items-center text-sm font-bold text-textPrimary">${top.name}</span>
        <span class="text-xs text-textSecondary mt-1 block">${formatMoney(top.price)}</span>
      </div>
      <input type="checkbox" id="top-${top.id}" name="topping" value="${top.name}" data-price="${top.price}">
    </label>
  `).join('');
};

const calcModalPrice = () => {
  const product = state.currentProduct;
  if (!product) return;
  let total = 0;
  let valid = true;

  if (['jugo', 'combinado', 'fresas_crema'].includes(product.type)) {
    const base = Array.from(document.getElementsByName('m_base')).find((input) => input.checked);
    if (base) total += Number(base.dataset.price || 0); else valid = false;
  }

  if (product.type === 'combinado') {
    const input = $('in-frutas-text');
    if (!input || !input.value.trim()) valid = false;
  }

  if (product.type === 'helado') {
    const size = Array.from(document.getElementsByName('h_size')).find((input) => input.checked);
    if (size) {
      total += Number(size.dataset.price || 0);
      const maxFlavors = Number(size.dataset.max || 1);
      const checked = Array.from(document.getElementsByName('h_flavor')).filter((input) => input.checked);
      if (checked.length > maxFlavors) {
        checked.at(-1).checked = false;
        showToast(`Esta presentacion solo permite ${maxFlavors} sabor(es).`);
      }
      if (Array.from(document.getElementsByName('h_flavor')).filter((input) => input.checked).length === 0) valid = false;
    } else {
      valid = false;
    }
  } else if (product.type === 'malteada') {
    total += product.price;
    if (!Array.from(document.getElementsByName('h_flavor')).find((input) => input.checked)) valid = false;
  } else if (!['jugo', 'combinado', 'fresas_crema', 'helado'].includes(product.type)) {
    total += product.price;
  }

  document.getElementsByName('topping').forEach((checkbox) => {
    if (checkbox.checked) total += Number(checkbox.dataset.price || 0);
  });

  state.livePrice = total;
  const priceEl = $('m-price');
  if (priceEl) priceEl.textContent = total > 0 ? formatMoney(total) : '$0';
  const btn = $('btn-add-to-cart');
  if (btn) btn.disabled = !valid;
};

const closeModal = () => {
  const overlay = $('modal-product');
  const content = $('modal-content');
  if (!overlay || !content) return;
  overlay.classList.add('opacity-0');
  content.classList.add('translate-y-full');
  setTimeout(() => {
    overlay.classList.add('hidden');
    state.currentProduct = null;
  }, 320);
};

const showCategoriesView = () => {
  const categoriesView = $('menu-categories-view');
  const productsView = $('menu-products-view');
  if (categoriesView) categoriesView.classList.remove('hidden-view');
  if (productsView) productsView.classList.add('hidden-view');
};

const showProductsView = () => {
  const categoriesView = $('menu-categories-view');
  const productsView = $('menu-products-view');
  if (categoriesView) categoriesView.classList.add('hidden-view');
  if (productsView) productsView.classList.remove('hidden-view');
};

const openModal = (productId) => {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  state.currentProduct = product;

  const img = $('m-img');
  const name = $('m-name');
  const desc = $('m-desc');
  if (img) { img.src = product.image; img.alt = `Imagen de ${product.name}`; }
  if (name) name.textContent = product.name;
  if (desc) {
    const descriptions = {
      helado: 'Elige tu presentacion, sabores y extras.',
      malteada: 'Vaso de 14 oz. Incluye crema chantilly.',
      fresas_crema: 'Elige tu aderezo: Leche Condensada o Arequipe.',
    };
    desc.textContent = descriptions[product.type] || product.description || 'Vaso de 22 oz.';
  }

  hideForms();
  const frutasInput = $('in-frutas-text');
  const granizadoInput = $('in-granizado');
  if (frutasInput) {
    frutasInput.value = '';
    frutasInput.oninput = calcModalPrice;
  }
  if (granizadoInput) granizadoInput.checked = false;

  if (['jugo', 'combinado'].includes(product.type)) {
    buildBaseOptions(product);
    showForm('form-base');
    showForm('form-granizado');
    if (product.type === 'combinado') showForm('form-frutas');
  }
  if (product.type === 'fresas_crema') {
    buildFresasOptions(product);
    showForm('form-base');
  }
  if (product.type === 'helado') {
    buildHeladoSizes();
    showForm('form-helado-size');
  }
  if (product.type === 'helado' || product.type === 'malteada') {
    buildFlavorOptions(product.type === 'malteada');
    showForm('form-helado-flavor');
  }
  if (product.hasToppings) {
    buildToppings();
    showForm('form-toppings');
  }

  $$('#m-forms input[type="radio"], #m-forms input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', calcModalPrice);
  });

  calcModalPrice();
  const overlay = $('modal-product');
  const content = $('modal-content');
  if (overlay && content) {
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.remove('opacity-0');
        content.classList.remove('translate-y-full');
      });
    });
  }
};

const addToCart = () => {
  const product = state.currentProduct;
  if (!product) return;
  const config = { base: '', frutasText: '', isGranizado: false, hSize: '', hFlavor: [], toppings: [] };

  if (['jugo', 'combinado', 'fresas_crema'].includes(product.type)) {
    const base = Array.from(document.getElementsByName('m_base')).find((input) => input.checked);
    if (!base) {
      showToast(product.type === 'fresas_crema' ? 'Selecciona Leche Condensada o Arequipe.' : 'Selecciona si lo deseas en Agua o en Leche.');
      return;
    }
    config.base = base.value;
  }

  if (product.type === 'combinado') {
    const frutasEl = $('in-frutas-text');
    const text = frutasEl ? frutasEl.value.trim() : '';
    if (!text) return showToast('Escribe las frutas que deseas combinar.');
    config.frutasText = text;
  }

  if (['jugo', 'combinado'].includes(product.type)) {
    const granizado = $('in-granizado');
    if (granizado?.checked) config.isGranizado = true;
  }

  if (product.type === 'helado') {
    const size = Array.from(document.getElementsByName('h_size')).find((input) => input.checked);
    if (!size) return showToast('Selecciona la presentacion del helado.');
    const sizeData = heladoSizes.find((item) => item.id === size.value);
    config.hSize = sizeData ? sizeData.name : size.value;
    const flavors = Array.from(document.getElementsByName('h_flavor')).filter((input) => input.checked).map((input) => input.value);
    if (!flavors.length) return showToast('Debes seleccionar al menos un sabor.');
    config.hFlavor = flavors;
  }

  if (product.type === 'malteada') {
    const flavor = Array.from(document.getElementsByName('h_flavor')).find((input) => input.checked);
    if (!flavor) return showToast('Selecciona el sabor de helado para tu malteada.');
    config.hFlavor = [flavor.value];
  }

  document.getElementsByName('topping').forEach((input) => {
    if (input.checked) config.toppings.push(input.value);
  });

  if (state.livePrice <= 0) return showToast('Completa la configuracion del producto antes de agregar.');

  state.cart = addCartItem(state.cart, {
    id: Date.now(),
    name: product.name,
    unitPrice: state.livePrice,
    qty: 1,
    config,
  });
  saveCart(state.cart);
  updateCartBadge();
  closeModal();
};

export const initMenuPage = () => {
  state.cart = loadCart();

  const modalRoot = $('modal-root');
  if (modalRoot) modalRoot.innerHTML = renderModalShell();
  const categoryGrid = $('category-grid');
  if (categoryGrid) categoryGrid.innerHTML = renderCategoryGrid(categories);

  $$('.category-card', categoryGrid || document).forEach((btn) => {
    btn.addEventListener('click', () => {
      state.lastCategoryId = btn.dataset.categoryId;
      const category = categories.find((item) => item.id === btn.dataset.categoryId);
      const title = $('cat-title');
      if (title) title.textContent = category ? category.label : 'Categoria';
      const list = $('product-list');
      if (!list) return;
      const categoryProducts = products.filter((item) => item.categoryId === btn.dataset.categoryId);
      list.innerHTML = renderProductList({ products: categoryProducts, getPriceLabel: (product) => getProductPriceLabel({ product, heladoSizes }) });
      $$('.add-product-btn', list).forEach((button) => {
        button.addEventListener('click', () => openModal(Number(button.dataset.productId)));
      });
      showProductsView();
    });
  });

  const closeBtn = $('btn-close-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  const addBtn = $('btn-add-to-cart');
  if (addBtn) addBtn.addEventListener('click', addToCart);
  const overlay = $('modal-product');
  if (overlay) overlay.addEventListener('click', (event) => { if (event.target === overlay) closeModal(); });

  const backBtn = $('btn-back-to-categories');
  if (backBtn) backBtn.addEventListener('click', () => {
    closeModal();
    showCategoriesView();
  });

  const category = categories.find((item) => item.id === state.lastCategoryId) || categories[0];
  const title = $('cat-title');
  if (title) title.textContent = category.label;
  const list = $('product-list');
  if (list) {
    const categoryProducts = products.filter((item) => item.categoryId === category.id);
    list.innerHTML = renderProductList({ products: categoryProducts, getPriceLabel: (product) => getProductPriceLabel({ product, heladoSizes }) });
    $$('.add-product-btn', list).forEach((button) => {
      button.addEventListener('click', () => openModal(Number(button.dataset.productId)));
    });
  }

  updateCartBadge();
  showCategoriesView();
};
