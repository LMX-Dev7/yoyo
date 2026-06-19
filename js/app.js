/**
 * =============================================================================
 * YOYO B&M — app.js
 * =============================================================================
 * Lógica central de la aplicación: navegación entre vistas, apertura y cierre
 * del modal de personalización de productos, gestión del carrito de compras y
 * generación del mensaje de pedido para WhatsApp.
 *
 * Depende de: js/database.js (debe cargarse antes en el HTML)
 * =============================================================================
 */

'use strict';

/* =============================================================================
 * Utilidades Globales
 * ========================================================================== */

/**
 * Formateador de moneda colombiana (COP).
 * Uso: COP.format(12000) → "$12.000"
 */
const COP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
});

/**
 * Shortcut para document.getElementById.
 * @param {string} id
 * @returns {HTMLElement|null}
 */
const $ = (id) => document.getElementById(id);

/* =============================================================================
 * Módulo Principal de la Aplicación
 * ========================================================================== */

const app = {

    /** Array de ítems en el carrito. Cada ítem contiene {id, name, unitPrice, qty, config} */
    cart: [],

    /** Producto actualmente seleccionado en el modal */
    currentProduct: null,

    /** Precio calculado en tiempo real en el modal */
    livePrice: 0,

    /** ID de la última categoría visitada (para el botón "Volver") */
    lastCategoryId: 'jugos',

    /* =========================================================================
     * Navegación entre Vistas
     * ======================================================================= */

    /**
     * Muestra la sección con el id `view-${viewId}` y oculta el resto.
     * @param {string} viewId — Sufijo del id de la sección (ej: 'home', 'main-menu')
     */
    navigate(viewId) {
        document.querySelectorAll('.view-section').forEach(el => {
            el.classList.add('hidden-view');
        });

        const target = $(`view-${viewId}`);
        if (!target) {
            console.error(`[app.navigate] No se encontró la vista: view-${viewId}`);
            return;
        }

        target.classList.remove('hidden-view');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /* =========================================================================
     * Pantalla de Inicio (Hero)
     * ======================================================================= */

    /**
     * Inicializa la pantalla de inicio con los datos de storeConfig.
     * Se llama una sola vez al cargar la página.
     */
    initHero() {
        /* Inyectar texto dinámico del negocio */
        const nameEl  = $('hero-store-name');
        const tagEl   = $('hero-tagline');
        const bgEl    = $('hero-bg');

        if (nameEl)  nameEl.textContent  = storeConfig.name;
        if (tagEl)   tagEl.textContent   = storeConfig.tagline;
        if (bgEl)    bgEl.style.backgroundImage = `url('${storeConfig.heroImage}')`;
    },

    /* =========================================================================
     * Menú Principal (Categorías)
     * ======================================================================= */

    /**
     * Renderiza dinámicamente las tarjetas de categorías usando el array `categories`
     * definido en database.js. Esto permite que el menú de categorías sea completamente
     * configurable sin tocar el HTML.
     */
    renderCategoryCards() {
        const grid = $('category-grid');
        if (!grid) return;

        grid.innerHTML = categories.map(cat => `
            <button
                data-category-id="${cat.id}"
                class="category-card group relative flex flex-col items-center justify-end overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-52"
                aria-label="Ver ${cat.label}"
            >
                <!-- Imagen de fondo de la categoría -->
                <div
                    class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style="background-image: url('${cat.cardImage}');"
                    aria-hidden="true"
                ></div>

                <!-- Overlay gradiente para legibilidad del texto -->
                <div class="absolute inset-0 bg-gradient-to-t from-textPrimary/70 via-textPrimary/20 to-transparent" aria-hidden="true"></div>

                <!-- Contenido -->
                <div class="relative z-10 w-full p-4 text-left">
                    <span class="block font-display font-bold text-white text-xl leading-tight drop-shadow-lg">
                        ${cat.label}
                    </span>
                    <span class="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-white/80">
                        Ver productos
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                        </svg>
                    </span>
                </div>
            </button>
        `).join('');

        /* Registrar los event listeners de las tarjetas */
        grid.querySelectorAll('.category-card').forEach(btn => {
            btn.addEventListener('click', () => {
                this.openCategory(btn.dataset.categoryId);
            });
        });
    },

    /* =========================================================================
     * Vista de Productos por Categoría
     * ======================================================================= */

    /**
     * Filtra y renderiza los productos de la categoría seleccionada,
     * luego navega a la vista de productos.
     * @param {string} categoryId — ID de la categoría a mostrar
     */
    openCategory(categoryId) {
        this.lastCategoryId = categoryId;

        /* Buscar la categoría en el catálogo */
        const cat = categories.find(c => c.id === categoryId);
        if (!cat) {
            console.error(`[app.openCategory] Categoría no encontrada: ${categoryId}`);
            return;
        }

        /* Actualizar el título de la vista de productos */
        const titleEl = $('cat-title');
        if (titleEl) titleEl.textContent = cat.label;

        /* Filtrar productos de la categoría */
        const categoryProducts = products.filter(p => p.categoryId === categoryId);

        /* Renderizar tarjetas de productos */
        const list = $('product-list');
        if (!list) return;

        list.innerHTML = categoryProducts.map(p => {
            /* Construir texto de precio según tipo de producto */
            let priceLabel = '';
            if (p.type === 'jugo' || p.type === 'combinado') {
                const basePrice = p.pAgua !== null ? p.pAgua : p.pLeche;
                priceLabel = `Desde ${COP.format(basePrice)}`;
            } else if (p.type === 'helado') {
                priceLabel = `Desde ${COP.format(heladoSizes[0].price)}`;
            } else {
                /* batido, malteada → precio fijo */
                priceLabel = COP.format(p.price);
            }

            return `
                <article class="product-card bg-white rounded-3xl p-4 shadow-sm border border-primary/10 flex items-center gap-4 slide-up hover:shadow-md transition-shadow duration-300">
                    <!-- Imagen del producto -->
                    <div class="relative shrink-0">
                        <img
                            src="${p.image}"
                            alt="Imagen de ${p.name}"
                            class="w-24 h-24 rounded-2xl object-cover bg-bgPrimary shadow-inner"
                            loading="lazy"
                        >
                    </div>

                    <!-- Información del producto -->
                    <div class="flex-1 min-w-0">
                        <h3 class="font-display font-bold text-lg leading-tight text-textPrimary truncate">${p.name}</h3>
                        ${p.description ? `<p class="text-xs text-textSecondary mt-0.5 leading-relaxed line-clamp-2">${p.description}</p>` : ''}
                        <div class="flex justify-between items-center mt-3">
                            <span class="font-bold text-accent text-sm">${priceLabel}</span>
                            <button
                                data-product-id="${p.id}"
                                class="add-product-btn w-9 h-9 bg-primary text-textPrimary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors duration-200 shadow-lg ring-1 ring-primary/25 shrink-0"
                                aria-label="Agregar ${p.name} al carrito"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        /* Registrar event listeners para los botones "agregar" */
        list.querySelectorAll('.add-product-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.openModal(parseInt(btn.dataset.productId, 10));
            });
        });

        this.navigate('products');
    },

    /* =========================================================================
     * Modal de Personalización de Producto
     * ======================================================================= */

    /**
     * Abre el modal del producto seleccionado, configura los formularios
     * correspondientes según el tipo de producto y calcula el precio inicial.
     * @param {number} productId — ID del producto a mostrar
     */
    openModal(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error(`[app.openModal] Producto no encontrado: ${productId}`);
            return;
        }

        this.currentProduct = product;

        /* Poblar datos básicos del modal */
        const imgEl  = $('m-img');
        const nameEl = $('m-name');
        const descEl = $('m-desc');

        if (imgEl)  { imgEl.src = product.image; imgEl.alt = `Imagen de ${product.name}`; }
        if (nameEl) nameEl.textContent = product.name;

        /* Descripción contextual por tipo */
        const descriptions = {
            helado:   'Elige tu presentacion, sabores y extras.',
            malteada: 'Vaso de 14 oz. Incluye crema chantilly.',
            fresas_crema: 'Elige tu aderezo: Leche Condensada o Arequipe.',
        };
        if (descEl) descEl.textContent = descriptions[product.type] || product.description || 'Vaso de 22 oz.';

        /* Ocultar todos los formularios opcionales antes de configurar */
        const allForms = ['form-frutas', 'form-base', 'form-granizado', 'form-helado-size', 'form-helado-flavor', 'form-toppings'];
        allForms.forEach(formId => {
            const el = $(formId);
            if (el) el.classList.add('hidden');
        });

        /* Limpiar valores previos */
        const frutasInput = $('in-frutas-text');
        const granizadoInput = $('in-granizado');
        if (frutasInput) {
            frutasInput.value = '';
            frutasInput.oninput = () => this.calcModalPrice();
        }
        if (granizadoInput) granizadoInput.checked = false;

        /* ------------------------------------------------------------------ */
        /* Configurar formulario según el tipo de producto                     */
        /* ------------------------------------------------------------------ */

        if (product.type === 'jugo' || product.type === 'combinado') {
            this._buildBaseOptions(product);
            this._showForm('form-base');
            this._showForm('form-granizado');
            if (product.type === 'combinado') this._showForm('form-frutas');
        }

        if (product.type === 'fresas_crema') {
            this._buildFresasOptions();
            this._showForm('form-base');
        }

        if (product.type === 'helado') {
            this._buildHeladoSizes();
            this._showForm('form-helado-size');
        }

        if (product.type === 'helado' || product.type === 'malteada') {
            this._buildFlavorOptions(product.type === 'malteada');
            this._showForm('form-helado-flavor');
        }

        /* Toppings: disponibles para todos los productos marcados con hasToppings */
        if (product.hasToppings) {
            this._buildToppingOptions();
            this._showForm('form-toppings');
        }

        /* Calcular precio inicial (puede ser $0 si hay selecciones pendientes) */
        this.calcModalPrice();

        /* Mostrar modal con animación */
        const modalOverlay = $('modal-product');
        const modalContent = $('modal-content');
        if (modalOverlay && modalContent) {
            modalOverlay.classList.remove('hidden');
            /* Delay mínimo para que el navegador aplique la transición CSS */
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    modalOverlay.classList.remove('opacity-0');
                    modalContent.classList.remove('translate-y-full');
                });
            });
        }
    },

    /**
     * Cierra el modal con animación de salida y limpia el estado.
     */
    closeModal() {
        const modalOverlay = $('modal-product');
        const modalContent = $('modal-content');
        if (!modalOverlay || !modalContent) return;

        modalOverlay.classList.add('opacity-0');
        modalContent.classList.add('translate-y-full');

        setTimeout(() => {
            modalOverlay.classList.add('hidden');
            this.currentProduct = null;
        }, 320);
    },

    /**
     * Helper: muestra un formulario del modal.
     * @param {string} formId
     */
    _showForm(formId) {
        const el = $(formId);
        if (el) el.classList.remove('hidden');
    },

    /**
     * Construye las opciones de base (Agua / Leche) para jugos.
     * @param {Object} product — Producto con campos `pAgua`, `pLeche`, `restrict`
     */
    _buildBaseOptions(product) {
        const container = $('base-options');
        if (!container) return;

        let html = '';

        if (product.pAgua !== null && product.restrict !== 'Leche') {
            html += this._radioCardHtml('m_base', 'Agua', product.pAgua, `En Agua`, COP.format(product.pAgua));
        }

        if (product.pLeche !== null && product.restrict !== 'Agua') {
            html += this._radioCardHtml('m_base', 'Leche', product.pLeche, `En Leche`, COP.format(product.pLeche));
        }

        container.innerHTML = html;

        /* Registrar listeners para recalcular precio al seleccionar base */
        container.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', () => this.calcModalPrice());
        });
    },

    /**
     * Construye las opciones para Fresas con Crema
     */
    _buildFresasOptions() {
        const container = $('base-options');
        const label = $('label-base');
        if (!container) return;

        if (label) {
            label.innerHTML = `Aderezo <span class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-2 uppercase tracking-wider">Obligatorio</span>`;
        }

        let html = '';
        html += this._radioCardHtml('m_base', 'Leche Condensada', 0, `Leche Condensada`, `Incluido`);
        html += this._radioCardHtml('m_base', 'Arequipe', 0, `Arequipe`, `Incluido`);
        container.innerHTML = html;

        container.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', () => this.calcModalPrice());
        });
    },

    /**
     * Construye las opciones de tamaño para helados.
     */
    _buildHeladoSizes() {
        const container = $('helado-sizes-container');
        if (!container) return;

        container.innerHTML = heladoSizes.map(size => `
            <label class="size-option border-2 border-primary/20 rounded-2xl p-3 flex justify-between items-center cursor-pointer hover:border-primary transition-colors duration-200 has-[:checked]:border-primary has-[:checked]:bg-primary/12">
                <div class="flex items-center gap-3">
                    <input
                        type="radio"
                        name="h_size"
                        value="${size.id}"
                        data-price="${size.price}"
                        data-max="${size.maxSabores}"
                        class="w-4 h-4"
                        style="accent-color: var(--color-primary);"
                    >
                    <span class="font-semibold text-sm text-textPrimary">${size.name}</span>
                </div>
                <span class="text-accent text-sm font-bold">${COP.format(size.price)}</span>
            </label>
        `).join('');

        /* Listeners: cambiar tamaño recalcula precio y limita sabores */
        container.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', () => this.calcModalPrice());
        });
    },

    /**
     * Construye las opciones de sabores de helado.
     * @param {boolean} isMalteada — Si es true, usa radio (1 sabor); si es false, usa checkbox (múltiples)
     */
    _buildFlavorOptions(isMalteada) {
        const container = $('helado-flavors-container');
        const hintEl    = $('flavor-hint');
        if (!container) return;

        const inputType = isMalteada ? 'radio' : 'checkbox';
        if (hintEl) {
            hintEl.textContent = isMalteada
                ? 'Selecciona 1 sabor para tu malteada.'
                : 'Sabores disponibles segun la presentacion elegida.';
        }

        container.innerHTML = sabores.map(sabor => `
            <label class="border-2 border-primary/20 rounded-2xl p-3 flex items-center justify-center gap-2 cursor-pointer hover:border-primary transition-colors duration-200 has-[:checked]:border-primary has-[:checked]:bg-primary/12 text-center">
                <input
                    type="${inputType}"
                    name="h_flavor"
                    value="${sabor}"
                    class="hidden"
                >
                <span class="font-semibold text-sm text-textPrimary">${sabor}</span>
            </label>
        `).join('');

        /* Listener: seleccionar sabor recalcula precio */
        container.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => this.calcModalPrice());
        });
    },

    /**
     * Construye la lista de toppings opcionales.
     */
    _buildToppingOptions() {
        const container = $('toppings-container');
        if (!container) return;

        /* Opción "Sin toppings" */
        let html = `
            <label class="border-2 border-red-100 bg-red-50 rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-colors duration-200 has-[:checked]:border-alert has-[:checked]:bg-alert/10">
                <input type="checkbox" id="top-no" class="w-4 h-4" style="accent-color: var(--color-alert);">
                <span class="font-bold text-sm text-alert">No, gracias. Sin toppings.</span>
            </label>
        `;

        /* Opciones de toppings individuales */
        html += toppings.map(t => `
            <label class="border-2 border-primary/20 rounded-2xl p-3 flex justify-between items-center cursor-pointer hover:border-primary transition-colors duration-200 has-[:checked]:border-primary has-[:checked]:bg-primary/12">
                <div class="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="topping"
                        value="${t.name}"
                        data-price="${t.price}"
                        class="w-4 h-4"
                        style="accent-color: var(--color-primary);"
                    >
                    <span class="font-semibold text-sm text-textPrimary">${t.name}</span>
                </div>
                <span class="text-accent text-sm font-bold">+ ${COP.format(t.price)}</span>
            </label>
        `).join('');

        container.innerHTML = html;

        /* Listener checkbox "Sin toppings": desmarca todos los demás */
        const noTopEl = $('top-no');
        if (noTopEl) {
            noTopEl.addEventListener('change', () => {
                if (noTopEl.checked) {
                    document.getElementsByName('topping').forEach(c => { c.checked = false; });
                }
                this.calcModalPrice();
            });
        }

        /* Listeners toppings: desmarcan "Sin toppings" si se elige alguno */
        document.getElementsByName('topping').forEach(input => {
            input.addEventListener('change', () => {
                const noTop = $('top-no');
                if (noTop) noTop.checked = false;
                this.calcModalPrice();
            });
        });
    },

    /**
     * Helper: genera el HTML de una tarjeta de opción radio con precio.
     * @param {string} name — Nombre del grupo radio
     * @param {string} value — Valor del input
     * @param {number} price — Precio numérico (data-price)
     * @param {string} label — Etiqueta principal
     * @param {string} priceLabel — Etiqueta de precio formateado
     * @returns {string} HTML de la tarjeta
     */
    _radioCardHtml(name, value, price, label, priceLabel) {
        return `
            <label class="border-2 border-primary/20 rounded-2xl p-3 flex flex-col items-center gap-1 cursor-pointer hover:border-primary transition-colors duration-200 has-[:checked]:border-primary has-[:checked]:bg-primary/12">
                <input type="radio" name="${name}" value="${value}" data-price="${price}" class="hidden">
                <span class="font-bold text-sm text-textPrimary">${label}</span>
                <span class="text-accent text-xs font-bold">${priceLabel}</span>
            </label>
        `;
    },

    /* =========================================================================
     * Cálculo de Precio en Tiempo Real
     * ======================================================================= */

    /**
     * Recalcula el precio total del producto actual considerando la selección
     * de base, tamaño de helado, sabores y toppings. Actualiza el botón del modal.
     * También valida el límite máximo de sabores para el helado.
     */
    calcModalPrice() {
        const product = this.currentProduct;
        if (!product) return;

        let total = 0;
        let isValid = true;

        /* --- Precio base según tipo de producto --- */
        if (product.type === 'jugo' || product.type === 'combinado' || product.type === 'fresas_crema') {
            const selectedBase = Array.from(document.getElementsByName('m_base')).find(r => r.checked);
            if (selectedBase) {
                total += parseInt(selectedBase.dataset.price, 10);
            } else {
                isValid = false;
            }
        }
        
        if (product.type === 'combinado') {
            const frutasEl = $('in-frutas-text');
            if (!frutasEl || !frutasEl.value.trim()) {
                isValid = false;
            }
        }

        if (product.type === 'helado') {
            const selectedSize = Array.from(document.getElementsByName('h_size')).find(r => r.checked);
            if (selectedSize) {
                total += parseInt(selectedSize.dataset.price, 10);

                /* Validar límite de sabores para el tamaño elegido */
                const maxFlavors = parseInt(selectedSize.dataset.max, 10);
                const checkedFlavors = Array.from(document.getElementsByName('h_flavor')).filter(f => f.checked);
                if (checkedFlavors.length > maxFlavors) {
                    /* Desmarcar el último sabor seleccionado y avisar al usuario */
                    checkedFlavors[checkedFlavors.length - 1].checked = false;
                    this._showToast(`Esta presentacion solo permite ${maxFlavors} sabor(es).`);
                }
                
                const validFlavors = Array.from(document.getElementsByName('h_flavor')).filter(f => f.checked);
                if (validFlavors.length === 0) isValid = false;
            } else {
                isValid = false;
            }
        } else if (product.type === 'malteada') {
            total += product.price;
            const flavorInput = Array.from(document.getElementsByName('h_flavor')).find(f => f.checked);
            if (!flavorInput) isValid = false;
        } else if (product.type !== 'jugo' && product.type !== 'combinado' && product.type !== 'fresas_crema' && product.type !== 'helado') {
            /* batido → precio fijo */
            total += product.price;
        }

        /* --- Sumar toppings seleccionados --- */
        document.getElementsByName('topping').forEach(checkbox => {
            if (checkbox.checked) {
                total += parseInt(checkbox.dataset.price, 10);
            }
        });

        this.livePrice = total;

        /* Actualizar precio en el botón del modal */
        const priceEl = $('m-price');
        if (priceEl) priceEl.textContent = total > 0 ? COP.format(total) : '$0';

        const btnAdd = $('btn-add-to-cart');
        if (btnAdd) {
            btnAdd.disabled = !isValid;
        }
    },

    /* =========================================================================
     * Carrito de Compras
     * ======================================================================= */

    /**
     * Valida la selección del usuario y añade el producto configurado al carrito.
     * Si la validación falla, muestra un toast de error y detiene la operación.
     */
    addToCart() {
        const product = this.currentProduct;
        if (!product) return;

        /* Objeto de configuración del ítem */
        const config = {
            base: '',
            frutasText: '',
            isGranizado: false,
            hSize: '',
            hFlavor: [],
            toppings: [],
        };

        /* --- Validar y capturar base (jugos y fresas) --- */
        if (product.type === 'jugo' || product.type === 'combinado' || product.type === 'fresas_crema') {
            const baseInput = Array.from(document.getElementsByName('m_base')).find(r => r.checked);
            if (!baseInput) {
                const msg = product.type === 'fresas_crema' ? 'Selecciona Leche Condensada o Arequipe.' : 'Selecciona si lo deseas en Agua o en Leche.';
                this._showToast(msg);
                return;
            }
            config.base = baseInput.value;
        }

        /* --- Validar y capturar frutas combinadas --- */
        if (product.type === 'combinado') {
            const frutasEl = $('in-frutas-text');
            const text = frutasEl ? frutasEl.value.trim() : '';
            if (!text) {
                this._showToast('Escribe las frutas que deseas combinar.');
                return;
            }
            config.frutasText = text;
        }

        /* --- Capturar opción de granizado --- */
        if (product.type === 'jugo' || product.type === 'combinado') {
            const granizadoEl = $('in-granizado');
            if (granizadoEl && granizadoEl.checked) config.isGranizado = true;
        }

        /* --- Validar y capturar tamaño de helado --- */
        if (product.type === 'helado') {
            const sizeInput = Array.from(document.getElementsByName('h_size')).find(r => r.checked);
            if (!sizeInput) {
                this._showToast('Selecciona la presentacion del helado.');
                return;
            }
            const sizeData = heladoSizes.find(s => s.id === sizeInput.value);
            config.hSize = sizeData ? sizeData.name : sizeInput.value;
        }

        /* --- Validar y capturar sabores de helado --- */
        if (product.type === 'helado') {
            const selectedFlavors = Array.from(document.getElementsByName('h_flavor'))
                .filter(f => f.checked)
                .map(f => f.value);
            if (selectedFlavors.length === 0) {
                this._showToast('Debes seleccionar al menos un sabor.');
                return;
            }
            config.hFlavor = selectedFlavors;
        }

        /* --- Validar y capturar sabor de malteada (1 obligatorio) --- */
        if (product.type === 'malteada') {
            const flavorInput = Array.from(document.getElementsByName('h_flavor')).find(f => f.checked);
            if (!flavorInput) {
                this._showToast('Selecciona el sabor de helado para tu malteada.');
                return;
            }
            config.hFlavor = [flavorInput.value];
        }

        /* --- Capturar toppings seleccionados --- */
        document.getElementsByName('topping').forEach(checkbox => {
            if (checkbox.checked) config.toppings.push(checkbox.value);
        });

        /* Validar que el precio sea mayor a $0 antes de agregar */
        if (this.livePrice <= 0) {
            this._showToast('Completa la configuracion del producto antes de agregar.');
            return;
        }

        /* Añadir ítem al carrito */
        this.cart.push({
            id: Date.now(),   /* ID único del ítem (timestamp) */
            name: product.name,
            unitPrice: this.livePrice,
            qty: 1,
            config: config,
        });

        this.closeModal();
        this.updateCartBadge();
        this._animateCartButton();
    },

    /**
     * Actualiza el badge (contador) en el botón flotante del carrito.
     */
    updateCartBadge() {
        const badge  = $('cart-badge');
        const button = $('floating-cart');
        if (!badge || !button) return;

        const totalItems = this.cart.reduce((sum, item) => sum + item.qty, 0);
        badge.textContent = totalItems;

        if (totalItems > 0) {
            button.classList.remove('hidden');
        } else {
            button.classList.add('hidden');
        }
    },

    /**
     * Abre la vista del carrito y renderiza su contenido.
     */
    openCart() {
        this.renderCart();
        const cartView = $('view-cart');
        if (cartView) cartView.classList.remove('hidden-view');
    },

    /**
     * Cierra la vista del carrito.
     */
    closeCart() {
        const cartView = $('view-cart');
        if (cartView) cartView.classList.add('hidden-view');
    },

    /**
     * Renderiza el contenido del carrito (ítems, subtotales y formulario de entrega).
     */
    renderCart() {
        const itemsContainer  = $('cart-items');
        const checkoutForm    = $('checkout-form');
        const sendOrderButton = $('btn-send-order');
        if (!itemsContainer) return;

        itemsContainer.innerHTML = '';

        if (this.cart.length === 0) {
            /* Estado vacío */
            if (checkoutForm)    checkoutForm.classList.add('hidden');
            if (sendOrderButton) {
                sendOrderButton.disabled = true;
                sendOrderButton.classList.add('opacity-50', 'cursor-not-allowed');
            }

            itemsContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center py-16 text-textSecondary">
                    <svg class="w-16 h-16 mb-4 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <p class="font-display font-bold text-lg text-textSecondary">Tu carrito esta vacio</p>
                    <p class="text-sm text-textSecondary mt-1">Agrega productos del menu para comenzar.</p>
                </div>
            `;
            return;
        }

        /* Carrito con ítems */
        if (checkoutForm)    checkoutForm.classList.remove('hidden');
        if (sendOrderButton) {
            sendOrderButton.disabled = false;
            sendOrderButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        this.cart.forEach((item, index) => {
            /* Construir badges de configuracion */
            let configBadges = '';
            if (item.config.base)        configBadges += `<span class="config-badge">En ${item.config.base}</span>`;
            if (item.config.isGranizado) configBadges += `<span class="config-badge">Granizado</span>`;
            if (item.config.hSize)       configBadges += `<span class="config-badge">${item.config.hSize}</span>`;

            /* Textos adicionales */
            let extraText = '';
            if (item.config.frutasText)        extraText += `<p class="text-xs text-textSecondary mt-1">Frutas: ${item.config.frutasText}</p>`;
            if (item.config.hFlavor.length > 0) extraText += `<p class="text-xs text-textSecondary mt-1">Sabores: ${item.config.hFlavor.join(', ')}</p>`;
            if (item.config.toppings.length > 0) extraText += `<p class="text-xs font-semibold text-accent mt-1">Toppings: ${item.config.toppings.join(', ')}</p>`;

            itemsContainer.innerHTML += `
                <article class="bg-white p-4 rounded-3xl shadow-sm border border-primary/10 relative slide-up" data-cart-index="${index}">
                    <!-- Boton eliminar -->
                    <button
                        class="remove-item-btn absolute top-4 right-4 text-textSecondary hover:text-alert transition-colors duration-200"
                        data-index="${index}"
                        aria-label="Eliminar ${item.name} del carrito"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>

                    <h4 class="font-display font-bold text-textPrimary pr-8 mb-1">${item.name}</h4>
                    ${configBadges ? `<div class="flex flex-wrap gap-1 mb-1">${configBadges}</div>` : ''}
                    ${extraText}

                    <!-- Controles de cantidad y precio -->
                    <div class="flex justify-between items-center mt-3 pt-3 border-t border-primary/15">
                        <span class="font-bold text-accent">${COP.format(item.unitPrice * item.qty)}</span>
                        <div class="qty-controls flex items-center bg-bgPrimary rounded-xl p-1 border border-primary/15">
                            <button class="decrease-qty-btn w-7 h-7 flex items-center justify-center text-textSecondary font-bold hover:text-alert transition-colors" data-index="${index}" aria-label="Reducir cantidad">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"/></svg>
                            </button>
                            <span class="text-sm font-bold w-6 text-center text-textPrimary">${item.qty}</span>
                            <button class="increase-qty-btn w-7 h-7 flex items-center justify-center text-primary font-bold hover:text-accent transition-colors" data-index="${index}" aria-label="Aumentar cantidad">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                            </button>
                        </div>
                    </div>
                </article>
            `;
        });

        /* Calcular y mostrar total del carrito */
        const grandTotal = this.cart.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
        const totalEl = $('cart-total-price');
        if (totalEl) totalEl.textContent = COP.format(grandTotal);

        /* Registrar event listeners de los controles del carrito */
        itemsContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', () => this.removeFromCart(parseInt(btn.dataset.index, 10)));
        });

        itemsContainer.querySelectorAll('.decrease-qty-btn').forEach(btn => {
            btn.addEventListener('click', () => this.updateQty(parseInt(btn.dataset.index, 10), -1));
        });

        itemsContainer.querySelectorAll('.increase-qty-btn').forEach(btn => {
            btn.addEventListener('click', () => this.updateQty(parseInt(btn.dataset.index, 10), +1));
        });
    },

    /**
     * Actualiza la cantidad de un ítem. Si llega a 0, lo elimina del carrito.
     * @param {number} index — Posición del ítem en `this.cart`
     * @param {number} delta — +1 para aumentar, -1 para disminuir
     */
    updateQty(index, delta) {
        if (this.cart[index] === undefined) return;
        this.cart[index].qty += delta;
        if (this.cart[index].qty <= 0) {
            this.cart.splice(index, 1);
        }
        this.updateCartBadge();
        this.renderCart();
    },

    /**
     * Elimina un ítem del carrito por su índice.
     * @param {number} index
     */
    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.updateCartBadge();
        this.renderCart();
    },

    /* =========================================================================
     * Envío de Pedido por WhatsApp
     * ======================================================================= */

    /**
     * Valida el formulario de entrega y genera el mensaje de WhatsApp
     * con el detalle completo del pedido (sin emojis, formateado en texto plano).
     */
    sendOrder() {
        const addressInput = $('cart-address');
        const addressError = $('address-error');
        const notesInput   = $('cart-notes');

        const address = addressInput ? addressInput.value.trim() : '';
        const notes   = notesInput  ? notesInput.value.trim()   : '';

        /* Validar campo de dirección obligatorio */
        if (!address) {
            if (addressInput) {
                addressInput.classList.add('border-red-400');
                addressInput.focus();
            }
            if (addressError) addressError.classList.remove('hidden');
            return;
        }

        /* Limpiar estado de error */
        if (addressInput) addressInput.classList.remove('border-red-400');
        if (addressError) addressError.classList.add('hidden');

        /* Construir mensaje de WhatsApp (texto plano, sin emojis) */
        let grandTotal = 0;
        let message = `*NUEVO PEDIDO — ${storeConfig.name.toUpperCase()}*\n\n`;
        message += `Direccion: ${address}\n`;
        if (notes) message += `Notas: ${notes}\n`;
        message += `\n*DETALLE DEL PEDIDO:*\n\n`;

        this.cart.forEach(item => {
            grandTotal += item.unitPrice * item.qty;
            message += `${item.qty}x ${item.name}`;
            if (item.config.base)              message += ` — En ${item.config.base}`;
            if (item.config.isGranizado)       message += ` — Granizado`;
            if (item.config.frutasText)        message += `\n   Frutas: ${item.config.frutasText}`;
            if (item.config.hSize)             message += `\n   Tamano: ${item.config.hSize}`;
            if (item.config.hFlavor.length > 0) message += `\n   Sabores: ${item.config.hFlavor.join(', ')}`;
            if (item.config.toppings.length > 0) message += `\n   Toppings: ${item.config.toppings.join(', ')}`;
            message += `\n   Subtotal: ${COP.format(item.unitPrice * item.qty)}\n\n`;
        });

        message += `*TOTAL PRODUCTOS: ${COP.format(grandTotal)}*\n`;
        message += `Domicilio: ${storeConfig.deliveryFeeText}`;

        /* Abrir WhatsApp con el mensaje codificado */
        const whatsappUrl = `https://wa.me/${storeConfig.whatsappPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    },

    /* =========================================================================
     * Utilidades UI
     * ======================================================================= */

    /**
     * Muestra un toast de notificación temporal en la parte inferior de la pantalla.
     * Reemplaza los alert() bloqueantes del navegador.
     * @param {string} message — Texto del mensaje
     * @param {number} [duration=3000] — Duración en milisegundos
     */
    _showToast(message, duration = 3000) {
        /* Eliminar toast previo si existe */
        const existing = document.querySelector('.app-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'app-toast';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = message;

        document.body.appendChild(toast);

        /* Forzar reflow para que la animación de entrada funcione */
        requestAnimationFrame(() => {
            toast.classList.add('app-toast--visible');
        });

        /* Ocultar y eliminar tras la duración */
        setTimeout(() => {
            toast.classList.remove('app-toast--visible');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    },

    /**
     * Anima el botón flotante del carrito (efecto de pulso al agregar un ítem).
     */
    _animateCartButton() {
        const btn = $('floating-cart');
        if (!btn) return;
        btn.classList.add('scale-125');
        setTimeout(() => btn.classList.remove('scale-125'), 250);
    },

    /* =========================================================================
     * Inicialización
     * ======================================================================= */

    /**
     * Inicializa la aplicación: configura los datos del negocio, renderiza
     * las tarjetas de categorías y navega a la vista de inicio.
     * Se llama una sola vez cuando el DOM está listo.
     */
    init() {
        /* Aplicar configuración del negocio al DOM */
        this.initHero();

        /* Renderizar categorías dinámicamente desde database.js */
        this.renderCategoryCards();

        /* Registrar event listener del botón "Volver" en vista de productos */
        const backBtn = $('btn-back-to-menu');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.navigate('main-menu'));
        }

        /* Registrar event listener del botón de abrir carrito */
        const cartBtn = $('floating-cart');
        if (cartBtn) cartBtn.addEventListener('click', () => this.openCart());

        /* Registrar event listener del botón de cerrar carrito */
        const closeCartBtn = $('btn-close-cart');
        if (closeCartBtn) closeCartBtn.addEventListener('click', () => this.closeCart());

        /* Registrar event listener del botón de enviar pedido */
        const sendBtn = $('btn-send-order');
        if (sendBtn) sendBtn.addEventListener('click', () => this.sendOrder());

        /* Registrar event listener del botón "PEDIR AHORA" */
        const ctaBtn = $('btn-cta');
        if (ctaBtn) ctaBtn.addEventListener('click', () => this.navigate('main-menu'));

        /* Registrar event listener del botón de cerrar modal */
        const closeModalBtn = $('btn-close-modal');
        if (closeModalBtn) closeModalBtn.addEventListener('click', () => this.closeModal());

        /* Registrar event listener del botón "Agregar al Pedido" del modal */
        const addToCartBtn = $('btn-add-to-cart');
        if (addToCartBtn) addToCartBtn.addEventListener('click', () => this.addToCart());

        /* Cerrar modal al hacer clic en el overlay de fondo */
        const modalOverlay = $('modal-product');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) this.closeModal();
            });
        }

        /* Limpiar error de dirección al escribir */
        const addressInput = $('cart-address');
        if (addressInput) {
            addressInput.addEventListener('input', () => {
                addressInput.classList.remove('border-red-400');
                const errEl = $('address-error');
                if (errEl) errEl.classList.add('hidden');
            });
        }

        /* Navegar a la pantalla de inicio */
        this.navigate('home');

        console.info(`[${storeConfig.name}] Aplicacion iniciada correctamente.`);
    },
};

/* =============================================================================
 * Punto de Entrada — Esperar a que el DOM esté completamente cargado
 * ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
