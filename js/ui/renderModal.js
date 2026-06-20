export const renderModalShell = () => `
<div id="modal-product" class="fixed inset-0 z-50 flex justify-center items-end hidden opacity-0 transition-opacity duration-200" role="dialog" aria-modal="true" aria-labelledby="m-name">
  <div id="modal-content" class="bg-cardBg w-full max-w-lg rounded-t-[2rem] max-h-[92vh] flex flex-col transform translate-y-full transition-transform duration-200 border-t border-black/5" role="document">
    <div class="absolute -top-14 inset-x-0 flex justify-center" aria-hidden="true">
      <div class="modal-product-image">
        <img id="m-img" src="" alt="" width="128" height="128">
      </div>
    </div>
    <button id="btn-close-modal" type="button" class="absolute top-4 right-4 w-10 h-10 bg-cardBg rounded-full flex items-center justify-center text-textSecondary border border-black/10 z-10" aria-label="Cerrar">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
    <div class="overflow-y-auto no-scrollbar flex-1 px-6 pt-20 pb-4">
      <div class="text-center mb-6">
        <h3 id="m-name" class="text-2xl font-display font-bold text-textPrimary mb-1">Nombre del producto</h3>
        <p id="m-desc" class="text-sm text-textSecondary leading-relaxed">Descripcion del producto</p>
      </div>
      <div class="space-y-4" id="m-forms">
        <div id="form-frutas" class="hidden modal-form-section" role="group" aria-labelledby="label-frutas">
          <label id="label-frutas" class="flex items-center text-sm font-bold text-textPrimary mb-1">
            Frutas a combinar <span class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-2 uppercase tracking-wider">Obligatorio</span>
          </label>
          <p class="text-xs text-textSecondary mb-2">Elige 2 o 3 frutas de temporada.</p>
          <input type="text" id="in-frutas-text" class="fruits-input" placeholder="Ej: Mango, Fresa y Pina" autocomplete="off" aria-required="true" maxlength="100">
        </div>
        <div id="form-base" class="hidden modal-form-section" role="group" aria-labelledby="label-base">
          <label id="label-base" class="flex items-center text-sm font-bold text-textPrimary mb-3">
            Base del jugo <span class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-2 uppercase tracking-wider">Obligatorio</span>
          </label>
          <div class="grid grid-cols-2 gap-3" id="base-options" role="radiogroup" aria-label="Selecciona la base"></div>
        </div>
        <div id="form-granizado" class="hidden modal-form-section">
          <label class="granizado-toggle" for="in-granizado">
            <div>
              <span class="flex items-center text-sm font-bold text-textPrimary">Hacerlo Granizado <span class="bg-primary/15 text-textSecondary border border-primary/10 text-[10px] px-2 py-0.5 rounded-full ml-2 uppercase tracking-wider">Opcional</span></span>
              <span class="text-xs text-textSecondary mt-1 block">Toque extra refrescante con hielo triturado</span>
            </div>
            <input type="checkbox" id="in-granizado" aria-label="Agregar granizado">
          </label>
        </div>
        <div id="form-helado-size" class="hidden modal-form-section" role="group" aria-labelledby="label-size">
          <label id="label-size" class="flex items-center text-sm font-bold text-textPrimary mb-3">
            Presentacion <span class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-2 uppercase tracking-wider">Obligatorio</span>
          </label>
          <div class="flex flex-col gap-2" id="helado-sizes-container" role="radiogroup" aria-label="Elige el tamano del helado"></div>
        </div>
        <div id="form-helado-flavor" class="hidden modal-form-section" role="group" aria-labelledby="label-flavor">
          <label id="label-flavor" class="flex items-center text-sm font-bold text-textPrimary mb-1">
            Sabores <span class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-2 uppercase tracking-wider">Obligatorio</span>
          </label>
          <p id="flavor-hint" class="text-xs text-textSecondary mb-3">Selecciona tus sabores.</p>
          <div class="grid grid-cols-3 gap-2" id="helado-flavors-container"></div>
        </div>
        <div id="form-toppings" class="hidden modal-form-section">
          <h4 class="font-display font-bold text-lg mb-3 text-textPrimary flex items-center">Toppings Extras <span class="bg-primary/15 text-textSecondary border border-primary/10 text-[10px] px-2 py-0.5 rounded-full ml-2 uppercase tracking-wider">Opcional</span></h4>
          <div class="flex flex-col gap-2" id="toppings-container" role="group" aria-label="Selecciona toppings adicionales"></div>
        </div>
      </div>
    </div>
    <div class="p-4 border-t border-primary/20 bg-cardBg safe-bottom rounded-b-[2rem]">
      <button id="btn-add-to-cart" type="button" class="btn-primary w-full py-4 flex justify-between items-center px-6" aria-label="Agregar producto al pedido" disabled>
        <span class="text-lg">Agregar al Pedido</span>
        <span id="m-price" class="text-white text-2xl font-bold tabular-nums" aria-live="polite" aria-label="Precio actual">$0</span>
      </button>
    </div>
  </div>
</div>
`;

export const renderRadioCard = (name, value, price, label, priceLabel) => `
  <label class="border border-black/10 rounded-2xl p-3 flex flex-col items-center gap-1 cursor-pointer has-[:checked]:border-black/30 has-[:checked]:bg-black/5">
    <input type="radio" name="${name}" value="${value}" data-price="${price}" class="hidden">
    <span class="font-bold text-sm text-textPrimary">${label}</span>
    <span class="text-accent text-xs font-bold">${priceLabel}</span>
  </label>
`;
