/**
 * =============================================================================
 * YOYO B&M — database.js
 * =============================================================================
 * Archivo central de configuración y catálogo de productos.
 *
 * PARA REUTILIZAR EN OTRO NEGOCIO:
 *   1. Edita el objeto `storeConfig` con los datos de tu negocio.
 *   2. Modifica el array `categories` con tus categorías de menú.
 *   3. Reemplaza el array `products` con tus productos.
 *   4. Actualiza `toppings`, `heladoSizes` y `sabores` según tu oferta.
 *
 * Tipos de producto admitidos (campo `type`):
 *   - 'jugo'      → Tiene base (agua/leche), opción granizado
 *   - 'combinado' → Como 'jugo' pero con campo libre para escribir frutas
 *   - 'batido'    → Precio fijo, sin opciones extra de base
 *   - 'helado'    → Elige tamaño (determina precio y máximo de sabores)
 *   - 'malteada'  → Precio fijo, elige 1 sabor de helado
 * =============================================================================
 */

'use strict';

/**
 * storeConfig — Configuración global del negocio.
 * Modifica estos valores para adaptar la app a cualquier restaurante.
 */
const storeConfig = {
    /** Nombre comercial que aparece en el header, título SEO y mensajes de WhatsApp */
    name: "YOYO B&M",

    /** Descripción corta para el subtítulo de la pantalla de inicio */
    tagline: "Batidos, granizados y helados con fruta natural",

    /** Número de WhatsApp en formato internacional sin espacios ni símbolos */
    whatsappPhone: "573009414019",

    /** Texto informativo del costo de domicilio (solo informativo, no es un cálculo automático) */
    deliveryFeeText: "Domicilio desde $2.000 COP — acordar con el negocio",

    /** URL de imagen de alta calidad para el fondo del hero en la pantalla de inicio */
    heroImage: "https://images.unsplash.com/photo-1641665271888-575e46923776?q=80&auto=format&fit=crop",

    /**
     * URL del logo del negocio. Reemplaza esta URL con la imagen real del logo.
     * Se recomienda imagen cuadrada (ej: 400x400px) en formato PNG con fondo transparente.
     */
    logoUrl: "https://images.unsplash.com/photo-1594489556673-c816408242f5?q=80&auto=format&fit=crop",

    /** Ciudad o localización para el pie de página y SEO */
    location: "Barranquilla, Colombia",

    /** Horario de atención en formato legible */
    openingHours: "Lunes a Domingo — 3:30 PM a 11:00 PM",

    /** Teléfono de contacto en formato legible para la interfaz */
    phoneDisplay: "+57 300 941 4019",

    /** URL canónica del sitio para SEO */
    canonicalUrl: "https://yoyobym.com.co/",

    /** Descripción SEO para la etiqueta meta description */
    metaDescription: "Disfruta de los mejores jugos naturales, granizados, batidos especiales, helados y malteadas en Barranquilla. Arma tu pedido y envíalo por WhatsApp.",
};

/**
 * categories — Categorías del menú.
 * Cada categoría representa una sección de productos.
 * El campo `colorClasses` usa clases de Tailwind CSS para el estilo de la tarjeta.
 * El campo `iconPath` es el atributo `d` de un SVG path de Heroicons (https://heroicons.com).
 */
const categories = [
    {
        id: 'jugos',
        label: 'Jugos y Granizados',
        colorFrom: '#dcfce7',       /* Equivalente a green-100 */
        colorTo:   '#bbf7d0',       /* Equivalente a green-200 */
        accentColor: '#15803d',     /* Texto: green-700 */
        circleColor: '#86efac',     /* Burbuja decorativa: green-300 */
        /** Icono SVG (outline) — vaso de jugo */
        iconPath: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0a2 2 0 002 2h4a2 2 0 002-2M9 14H5a2 2 0 01-2-2V9m16 5V9m0 0a2 2 0 00-2-2H9',
        /** Imagen de portada de categoría (se muestra en la tarjeta) */
        cardImage: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80&auto=format&fit=crop",
    },
    {
        id: 'batidos',
        label: 'Batidos Especiales',
        colorFrom: '#fef9c3',
        colorTo:   '#fef08a',
        accentColor: '#854d0e',
        circleColor: '#fde047',
        /** Icono SVG (outline) — batidora / vaso con popote */
        iconPath: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
        cardImage: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80&auto=format&fit=crop",
    },
    {
        id: 'helados',
        label: 'Helados Artesanales',
        colorFrom: '#fce7f3',
        colorTo:   '#fbcfe8',
        accentColor: '#9d174d',
        circleColor: '#f9a8d4',
        /** Icono SVG (outline) — cono de helado */
        iconPath: 'M12 2C9.239 2 7 4.239 7 7c0 1.5.625 2.854 1.632 3.823L12 22l3.368-11.177A4.985 4.985 0 0017 7c0-2.761-2.239-5-5-5z',
        cardImage: "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600&q=80&auto=format&fit=crop",
    },
    {
        id: 'fresas_crema',
        label: 'Fresas con Crema',
        colorFrom: '#ffe4e6',
        colorTo:   '#fecdd3',
        accentColor: '#be123c',
        circleColor: '#fca5a5',
        /** Icono SVG (outline) — fresa/postre */
        iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
        cardImage: "https://images.unsplash.com/photo-1553177595-4de2bb0842b9?q=80&auto=format&fit=crop",
    },
];

/**
 * toppings — Lista de extras disponibles para todos los productos.
 * Añade o elimina objetos para gestionar la oferta de toppings.
 */
const toppings = [
    { id: 'oreo',        name: 'Oreo',            price: 1500 },
    { id: 'chantilly',   name: 'Crema Chantilly', price: 3000 },
    { id: 'fresas',      name: 'Fresas',          price: 3000 },
    { id: 'chips',       name: 'Galletas Chips',  price: 1500 },
    { id: 'jet',         name: 'Chocolatina Jet', price: 2500 },
    { id: 'trululu',     name: 'Gomitas Trululu', price: 1500 },
    { id: 'piazza',      name: 'Barquillo Piazza',price: 1500 },
    { id: 'leche_polvo', name: 'Leche en Polvo',  price: 2500 },
];

/**
 * heladoSizes — Presentaciones disponibles para el helado artesanal.
 * `maxSabores` controla cuántos sabores puede elegir el cliente.
 */
const heladoSizes = [
    { id: 'cono1',  name: 'Cono Sencillo (1 bola)',                   price: 5000,  maxSabores: 1 },
    { id: 'cono2',  name: 'Cono Doble (2 bolas)',                     price: 6000,  maxSabores: 2 },
    { id: 'vaso5',  name: 'Vaso 5 oz — 90 g (1 sabor)',               price: 5000,  maxSabores: 1 },
    { id: 'vaso7',  name: 'Vaso 7 oz — 130 g (hasta 2 sabores)',      price: 6000,  maxSabores: 2 },
    { id: 'vaso12', name: 'Vaso 12 oz — 200 g (hasta 3 sabores)',     price: 9000,  maxSabores: 3 },
];

/**
 * sabores — Sabores de helado disponibles.
 * Extensible: simplemente añade más strings al array.
 */
const sabores = ['Vainilla', 'Chocolate', 'Fresa'];

/**
 * products — Catálogo completo de productos.
 *
 * Campos comunes:
 *   id           {number}  Identificador único del producto.
 *   categoryId   {string}  Debe coincidir con un `id` en el array `categories`.
 *   type         {string}  'jugo' | 'combinado' | 'batido' | 'helado' | 'malteada'
 *   name         {string}  Nombre del producto.
 *   description  {string}  [Opcional] Descripción corta (ingredientes, presentación).
 *   image        {string}  URL de imagen de alta calidad.
 *   hasToppings  {boolean} Si muestra la sección de toppings opcionales.
 *
 * Campos por tipo:
 *   type 'jugo' / 'combinado':
 *     pAgua    {number|null}  Precio en agua. `null` si no aplica.
 *     pLeche   {number|null}  Precio en leche. `null` si no aplica.
 *     restrict {string}       [Opcional] 'Agua' o 'Leche' si solo admite una base.
 *
 *   type 'batido' | 'malteada':
 *     price    {number}       Precio fijo del producto.
 *
 *   type 'helado':
 *     price    {number}       Precio base (el real viene de heladoSizes).
 */
const products = [

    /* -------------------------------------------------------------------------
     * Jugos y Granizados
     * ----------------------------------------------------------------------- */
    {
        id: 1,
        categoryId: 'jugos',
        type: 'jugo',
        name: 'Fresa',
        description: 'Jugo natural de fresa, dulce y refrescante.',
        pAgua: 8000, pLeche: 10000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 2,
        categoryId: 'jugos',
        type: 'jugo',
        name: 'Pina',
        description: 'Jugo natural de pina, tropical y vibrante.',
        pAgua: 8000, pLeche: 10000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 3,
        categoryId: 'jugos',
        type: 'jugo',
        name: 'Mango',
        description: 'Jugo de mango costeño, espeso y lleno de sabor.',
        pAgua: 8000, pLeche: 10000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 4,
        categoryId: 'jugos',
        type: 'jugo',
        name: 'Melon',
        description: 'Jugo ligero y dulce de melon fresco.',
        pAgua: 8000, pLeche: 10000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1588661642878-a00685ea754d?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 5,
        categoryId: 'jugos',
        type: 'jugo',
        name: 'Zapote',
        description: 'Fruta tropical de sabor dulce y textura cremosa.',
        pAgua: 8000, pLeche: 10000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 6,
        categoryId: 'jugos',
        type: 'jugo',
        name: 'Banana',
        description: 'Solo disponible en leche. Cremoso y energizante.',
        pAgua: null, pLeche: 10000,
        restrict: 'Leche',
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1543218024-57a70143c369?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 7,
        categoryId: 'jugos',
        type: 'jugo',
        name: 'Nispero',
        description: 'Sabor dulce y suave, tipico de la costa Caribe.',
        pAgua: 8000, pLeche: 10000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 8,
        categoryId: 'jugos',
        type: 'jugo',
        name: 'Lulo',
        description: 'Agridulce y refrescante, una fruta colombiana unica.',
        pAgua: 8500, pLeche: 10000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 9,
        categoryId: 'jugos',
        type: 'jugo',
        name: 'Maracuya',
        description: 'Intenso y exotico, con el sabor de los tropicos.',
        pAgua: 8500, pLeche: 10000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1592994696-3bf82b339c24?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 10,
        categoryId: 'jugos',
        type: 'jugo',
        name: 'Mora',
        description: 'Jugoso y con ese toque acido que enamora.',
        pAgua: 8000, pLeche: 10000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1625671752324-0aa24a5b4dc3?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 11,
        categoryId: 'jugos',
        type: 'jugo',
        name: 'Frutos Rojos',
        description: 'Mezcla de fresa, mora y cereza. Antioxidante puro.',
        pAgua: 9000, pLeche: 11000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 12,
        categoryId: 'jugos',
        type: 'jugo',
        name: 'Guanabana',
        description: 'Cremosa y delicada, un clasico de jugos colombianos.',
        pAgua: 8000, pLeche: 10000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 13,
        categoryId: 'jugos',
        type: 'jugo',
        name: 'Limon',
        description: 'Solo en agua. Refrescante y natural, con toque de azucar.',
        pAgua: 8000, pLeche: null,
        restrict: 'Agua',
        hasToppings: false,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 14,
        categoryId: 'jugos',
        type: 'combinado',
        name: 'Frutas Combinadas',
        description: 'Crea tu mezcla ideal eligiendo 2 o 3 frutas de temporada.',
        pAgua: 10000, pLeche: 12000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&q=80&auto=format&fit=crop',
    },

    /* -------------------------------------------------------------------------
     * Batidos Especiales
     * ----------------------------------------------------------------------- */
    {
        id: 15,
        categoryId: 'batidos',
        type: 'batido',
        name: 'Limonada de Coco',
        description: 'Un clasico refrescante con leche de coco y limon.',
        price: 10000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 16,
        categoryId: 'batidos',
        type: 'batido',
        name: 'Oreo',
        description: 'Batido cremoso con galletas Oreo trituradas y leche fria.',
        price: 12000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 17,
        categoryId: 'batidos',
        type: 'batido',
        name: 'Galletas Chips',
        description: 'Batido con galletas de chispas de chocolate.',
        price: 12000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 18,
        categoryId: 'batidos',
        type: 'batido',
        name: 'Chocolate',
        description: 'Cremoso y profundo, para los amantes del chocolate.',
        price: 12000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 19,
        categoryId: 'batidos',
        type: 'batido',
        name: 'Cocosette',
        description: 'Batido con el sabor inconfundible de las galletas Cocosette.',
        price: 12000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 20,
        categoryId: 'batidos',
        type: 'batido',
        name: 'Milo',
        description: 'Batido energizante con polvo de Milo y leche entera.',
        price: 12000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop',
    },
    {
        id: 21,
        categoryId: 'batidos',
        type: 'batido',
        name: 'Cafe',
        description: 'Batido frio de cafe, perfecto para recargar energia.',
        price: 12000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80&auto=format&fit=crop',
    },

    /* -------------------------------------------------------------------------
     * Helados Artesanales
     * ----------------------------------------------------------------------- */
    {
        id: 22,
        categoryId: 'helados',
        type: 'helado',
        name: 'Helado Artesanal',
        description: 'Elige tu presentacion y tus sabores favoritos.',
        price: 5000, /* Precio base; el definitivo viene de heladoSizes */
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=400&q=80&auto=format&fit=crop',
    },

    /* -------------------------------------------------------------------------
     * Malteadas (Ahora en Batidos Especiales)
     * ----------------------------------------------------------------------- */
    {
        id: 23,
        categoryId: 'batidos',
        type: 'malteada',
        name: 'Malteada Clasica',
        description: 'Vaso 14 oz. 250 g de helado artesanal y crema chantilly.',
        price: 11000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&q=80&auto=format&fit=crop',
    },

    /* -------------------------------------------------------------------------
     * Fresas con Crema (Reemplaza a Malteadas)
     * ----------------------------------------------------------------------- */
    {
        id: 24,
        categoryId: 'fresas_crema',
        type: 'fresas_crema',
        name: 'Fresas con Crema',
        description: 'Vaso de 14 oz. Deliciosas fresas con crema. Elige: Leche Condensada o Arequipe.',
        price: 13000,
        hasToppings: true,
        image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?q=80&w=385&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
];

/*
 * Exportación: al no usar módulos ES6 para máxima compatibilidad de navegadores,
 * todas las constantes se exponen en el scope global para que app.js pueda accederlas.
 * Si en el futuro se adopta un bundler (Vite, Webpack), simplemente añade:
 *   export { storeConfig, categories, toppings, heladoSizes, sabores, products };
 */
